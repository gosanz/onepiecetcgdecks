export interface CardInterface {
  id: string;
  rarity: string;
  type: string;
  name: string;
  color: string[];
  card_cost: number;
  card_life: number;
  attribute: string[];
  power: number;
  counter: number;
  factions: string[];
  text: string;
  keywords: string[];
  edition: string;
  trigger: boolean;
}

export interface CardCompProps {
  card: CardInterface; // Usa el tipo importado
}

export interface CardsCompsProps {
  cards: CardInterface[];
}
export interface TableCompProps<T extends object, V> {
  data: T[];
  display?: (keyof T)[];
  excludeFields?: (keyof T)[];
  additionalField?: {
    key: string;
    value: V;
  };
}
