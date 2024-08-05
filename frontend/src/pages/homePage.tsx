import SearchBarComp from "../components/searchbar/searchBar";
import { useCallback, useState, useEffect } from "react";
import { CardInterface } from "../interfaces/card-interface";
import TableComp from "../components/table/table";

export default function HomePage() {
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [query, setQuery] = useState("");
  const API_URL = "http://127.0.0.1:5000/cards";
  const loadCards = useCallback(async () => {
    try {
      if (query !== "") {
        const response = await fetch(`${API_URL}?query=${query}&sort=name,asc`);
        const data: CardInterface[] = await response.json();
        setCards(data);
      }
    } catch {
      console.error("error");
    }
  }, [query]);

  useEffect(() => {
    loadCards();
    setCards([]);
  }, [query, loadCards]);
  return (
    <>
      <SearchBarComp query={query} setQuery={setQuery} />
      <TableComp
        data={cards}
        display={["name", "id", "rarity"]}
        additionalField={{ key: "img", value: "" }}
      />
    </>
  );
}
