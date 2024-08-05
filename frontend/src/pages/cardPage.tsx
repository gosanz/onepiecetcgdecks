import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardComp from "../components/card/card";
import { CardInterface } from "../interfaces/card-interface";

export default function CardPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<CardInterface | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/card/${cardId}`);
        const data: CardInterface = await response.json();
        setCard(data);
      } catch (error) {
        console.error("Error fetching card:", error);
      }
    };

    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  if (!card) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mt-4 flex justify-items-center">
        <CardComp card={card} />
      </div>
    </>
  );
}
