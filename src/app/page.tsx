"use client";

import { TSearchResult } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<TSearchResult>({ results: [], duration: 0 });
  useEffect(() => {
    const fetchData = async () => {
      if(!input) return setSearchResults({ results: [], duration: 0 });
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
    <div>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        type="text" />
    </div>
  );
}
