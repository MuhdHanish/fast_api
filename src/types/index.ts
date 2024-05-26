export type TSearchResult = {
    results: string[];
    duration: number;
};

export type TEnvConfig = {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
};