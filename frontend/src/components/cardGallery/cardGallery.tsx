import { useEffect, useState, useRef, useCallback } from "react";
import CardComp from "../card/card";
import { CardInterface } from "../../interfaces/card-interface";
import SearchBarComp from "../searchbar/searchBar";
import FiltersComp from "../filters/filters";

const PAGE_SIZE = 20;
const API_URL = "http://127.0.0.1:5000/cards";

export default function CardGalleryComp() {
  const [cards, setCards] = useState<CardInterface[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    attribute: "",
    colors: [] as string[],
    cost_life: "",
    counter: "",
    edition: "",
    types: [] as string[],
    keywords: [] as string[],
    power: "",
    hasTrigger: "",
    rarities: [] as string[],
    attributes: [] as string[],
  });
  const observer = useRef<IntersectionObserver | null>(null);

  const colors = ["Red", "Green", "Blue", "Purple", "Yellow", "Black"];
  const types = ["CHARACTER", "LEADER", "EVENT", "STAGE"];
  const keywords = [
    "Blocker",
    "DON!! x1",
    "On Block",
    "On Play",
    "When Attacking",
    "Rush",
    "On K.O.",
  ];
  const hasTrigger = "";
  const rarities = ["L", "C", "UC", "R", "SR", "SEC", "SP CARD"];
  const attributes = ["Slash", "Strike", "Ranged", "Wisdom", "Special"];

  const loadCards = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const filterParams = new URLSearchParams({
          query: query,
          page: page.toString(),
          size: PAGE_SIZE.toString(),
          attribute: activeFilters.attribute,
          cost_life: activeFilters.cost_life,
          counter: activeFilters.counter,
          edition: activeFilters.edition,
          keywords: activeFilters.keywords.join(","),
          power: activeFilters.power,
          colors: activeFilters.colors.join(","),
          types: activeFilters.types.join(","),
          hasTrigger: activeFilters.hasTrigger,
          rarities: activeFilters.rarities.join(","),
          attributes: activeFilters.attributes.join(","),
        });

        const response = await fetch(`${API_URL}?${filterParams.toString()}`);
        const data: CardInterface[] = await response.json();
        setCards((prevCards) => (page === 1 ? data : [...prevCards, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
      setLoading(false);
    },
    [query, activeFilters]
  );

  useEffect(() => {
    loadCards(page);
  }, [page, loadCards]);

  useEffect(() => {
    setPage(1);
    setCards([]);
    setHasMore(true);
  }, [query, activeFilters]);

  const handleFilterChange = (type: string, value: string) => {
    setActiveFilters((prevActiveFilters) => {
      const updatedFilters = { ...prevActiveFilters };
      if (type === "colors") {
        updatedFilters.colors = prevActiveFilters.colors.includes(value)
          ? prevActiveFilters.colors.filter((color) => color !== value)
          : [...prevActiveFilters.colors, value];
      } else if (type === "keywords") {
        updatedFilters.keywords = prevActiveFilters.keywords.includes(value)
          ? prevActiveFilters.keywords.filter((keyword) => keyword !== value)
          : [...prevActiveFilters.keywords, value];
      } else if (type === "types") {
        updatedFilters.types = prevActiveFilters.types.includes(value)
          ? prevActiveFilters.types.filter((type) => type !== value)
          : [...prevActiveFilters.types, value];
      } else if (type === "hasTrigger") {
        updatedFilters.hasTrigger =
          prevActiveFilters.hasTrigger === value
            ? (prevActiveFilters.hasTrigger = "no")
            : (prevActiveFilters.hasTrigger = value);
      } else if (type === "rarities") {
        updatedFilters.rarities = prevActiveFilters.rarities.includes(value)
          ? prevActiveFilters.rarities.filter((type) => type !== value)
          : [...prevActiveFilters.rarities, value];
      } else if (type === "attributes") {
        updatedFilters.attributes = prevActiveFilters.attributes.includes(value)
          ? prevActiveFilters.attributes.filter((type) => type !== value)
          : [...prevActiveFilters.attributes, value];
      }
      return updatedFilters;
    });
  };

  const lastCardRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <SearchBarComp query={query} setQuery={setQuery} />
      <div className="flex mt-5">
        <div className="w-1/5 flex-shrink-0 mr-10">
          <FiltersComp
            filters={{
              colors,
              keywords,
              types,
              hasTrigger,
              rarities,
              attributes,
            }}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="grid grid-cols-9 gap-4 w-4/5 mr-10">
          {cards.map((card, index) => (
            <div
              key={index}
              ref={index === cards.length - 1 ? lastCardRef : null}
            >
              <CardComp card={card} type="gallery" />
              <span>{index}</span>-<span>{cards.length}</span>
            </div>
          ))}
        </div>
      </div>
      {loading && <p>Loading...</p>}
    </>
  );
}
