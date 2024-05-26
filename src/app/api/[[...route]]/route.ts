import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import { TEnvConfig } from "@/types";
import { Redis } from "@upstash/redis";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/search", async (context) => {
    try {
        const query = context.req.query("query")?.toUpperCase();
        if (!query) return context.json({ message: "Invalid Search Query" }, 400);
        
        const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<TEnvConfig>(context);
        const redis = new Redis({
            url: UPSTASH_REDIS_REST_URL,
            token: UPSTASH_REDIS_REST_TOKEN
        });

        const startTime = performance.now();
        
        const results: string[] = [];
        const rank = await redis.zrank("terms", query);
        if (rank !== null && rank !== undefined) {
            const temp = await redis.zrange<string[]>("terms", rank, rank + 100);
            for (const element of temp) {
                if (!element.startsWith(query)) break;
                if (element.endsWith("*")) results.push(element.substring(0, element.length - 1));
            }
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        return context.json({ results, duration }, 200);
    } catch (error) {
        console.error('Error during search operation:', error);
        return context.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : "Unexpected Error" }, 500);
    }
});

export const GET = handle(app);

export default app as never;
