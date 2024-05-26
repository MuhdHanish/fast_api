"use client";

import { TSearchResult } from "@/types";
import { fetchCountries } from "@/utils";
import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const handleInputChange = (value: string) => setInput(value.trim());
  const [searchResults, setSearchResults] = useState<TSearchResult>({
    results: [],
    duration: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults({ results: [], duration: 0 });
      setError("");
      try {
        const data: TSearchResult = await fetchCountries(input, setError);
        setSearchResults(data);
      } catch (error) {
        setSearchResults({ results: [], duration: 0 });
      }
    };
    fetchData();
  }, [input]);

  return (
    <main className="h-screen w-screen grainy">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl tracking-tight font-bold">Speed Search</h1>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          A Hight-Performance API Built With Hono, Next.JS & Cloudflare. <br />
          <span className="text-base">
            Type A Qurey Below & Get Your Results In Miliseconds
          </span>
        </p>
        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              onValueChange={handleInputChange}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500"
            />
            <CommandList>
              {
                !searchResults?.results.length ? input && !error && <CommandEmpty>No Results Found !</CommandEmpty>
                  : input && <CommandGroup heading="Results">
                    {
                      searchResults?.results.map((result) => (
                        <CommandItem
                          key={result}
                          value={result}
                          onSelect={setInput}
                        >
                          {result}
                        </CommandItem>
                      ))
                    }
                  </CommandGroup>
              }
              {error && input && <CommandEmpty><span className="text-red-600">{error}</span></CommandEmpty>}
            </CommandList>
          </Command>
        </div>
      </div>
    </main>
  );
}
