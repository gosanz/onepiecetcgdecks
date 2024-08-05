import React from "react";

interface SearchBarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBarComp({ query, setQuery }: SearchBarProps) {
  return (
    <div className="w-full flex justify-center">
      <div className=" flex w-3/4 justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar una carta"
          className="search-bar  w-1/2 text-white bg-custom-dark mt-4 mb-4 p-2 border border-custom-silver rounded-lg"
        />
      </div>
    </div>
  );
}
