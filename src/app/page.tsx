"use client";

import { TSearchResult } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<TSearchResult>({ results: [], duration: 0 });
  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults({ results: [], duration: 0 });
      try {
        const response = await fetch(`/api/search?query=${input}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: TSearchResult = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSearchResults({ results: [], duration: 0 });
      }
    }
    fetchData();
  }, [input]);

  return (
    <main className="h-screen w-screen grainy">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <input
          type="text"
          value={input}
          className="text-zinc-900"
          onChange={(event) => setInput(event.target.value)}
        />
      </div>
    </main>
  );
}
