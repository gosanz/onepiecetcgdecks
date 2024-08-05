import { Button } from "@nextui-org/react";

interface FiltersProps {
  filters: {
    colors: string[];
    keywords: string[];
    types: string[];
    hasTrigger: string;
    rarities: string[];
    attributes: string[];
  };
  activeFilters: {
    colors: string[];
    keywords: string[];
    types: string[];
    hasTrigger: string;
    rarities: string[];
    attributes: string[];
  };
  onFilterChange: (type: string, value: string) => void;
}

export default function FiltersComp({
  filters,
  activeFilters,
  onFilterChange,
}: FiltersProps) {
  return (
    <>
      <h3>Colors</h3>
      <div className="grid grid-cols-3 gap-3">
        {filters.colors.map((color) => (
          <Button
            key={color} // Añadir una key única para cada elemento
            color={
              color === "Red"
                ? "danger"
                : color === "Green"
                ? "success"
                : color === "Blue"
                ? "primary"
                : color === "Purple"
                ? "secondary"
                : color === "Yellow"
                ? "warning"
                : "default"
            }
            className={
              activeFilters.colors.includes(color)
                ? "border-4 border-sky-500"
                : "border border-slate-300"
            }
            variant="bordered"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill={color.toLowerCase()}
                viewBox="0 0 16 16"
              >
                <circle cx="8" cy="8" r="8" />
              </svg>
            }
            onClick={() => onFilterChange("colors", color)}
          >
            <span className="text-lg font-semibold text-white">{color}</span>
          </Button>
        ))}
      </div>
      <h3>Keywords</h3>
      <div className="grid grid-cols-3 gap-3">
        {filters.keywords.map((keyword) => (
          <Button
            key={keyword}
            className={
              activeFilters.keywords.includes(keyword)
                ? "border-4 border-sky-500"
                : "border border-slate-300"
            }
            variant="bordered"
            onClick={() => onFilterChange("keywords", keyword)}
          >
            <span className="text-lg font-semibold text-white">{keyword}</span>
          </Button>
        ))}
      </div>
      <h3>Card Type</h3>
      <div className="grid grid-cols-3 gap-3">
        {filters.types.map((type) => (
          <Button
            key={type}
            className={
              activeFilters.types.includes(type)
                ? "border-4 border-sky-500"
                : "border border-slate-300"
            }
            variant="bordered"
            onClick={() => onFilterChange("types", type)}
          >
            <span className="text-lg font-semibold text-white">{type}</span>
          </Button>
        ))}
      </div>
      <h3>Rarity</h3>
      <div className="grid grid-cols-3 gap-3">
        {filters.rarities.map((rarity) => (
          <Button
            key={rarity}
            className={
              activeFilters.rarities.includes(rarity)
                ? "border-4 border-sky-500"
                : "border border-slate-300"
            }
            variant="bordered"
            onClick={() => onFilterChange("rarities", rarity)}
          >
            <span className="text-lg font-semibold text-white">{rarity}</span>
          </Button>
        ))}
      </div>
      <h3>Attributes</h3>
      <div className="grid grid-cols-3 gap-3">
        {filters.attributes.map((attribute) => (
          <Button
            key={attribute}
            className={
              activeFilters.attributes.includes(attribute)
                ? "border-4 border-sky-500"
                : "border border-slate-300"
            }
            variant="bordered"
            onClick={() => onFilterChange("attributes", attribute)}
          >
            <span className="text-lg font-semibold text-white">
              {attribute}
            </span>
          </Button>
        ))}
      </div>
      <h3>Has Trigger</h3>
      <div className="grid grid-cols-3 gap-3">
        <Button
          key={"has_trigger"}
          className={
            activeFilters.hasTrigger === "yes"
              ? "border-4 border-sky-500"
              : "border border-slate-300"
          }
          variant="bordered"
          onClick={() => onFilterChange("hasTrigger", "yes")}
        >
          <span className="text-lg font-semibold text-white">Trigger</span>
        </Button>
      </div>
    </>
  );
}
