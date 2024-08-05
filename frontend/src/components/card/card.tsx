import { Card, CardBody, Image } from "@nextui-org/react";
import { CardInterface } from "../../interfaces/card-interface";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";

interface CardCompProps {
  card: CardInterface;
  type?: string;
}

export default function CardComp({ card, type }: CardCompProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Card
        isFooterBlurred
        isPressable={type === "gallery" ? true : false}
        onPress={onOpen}
        radius="lg"
        className="border-none w-70"
      >
        <CardBody className="p-0">
          <Image
            alt=""
            src={`/cards/${card.id}.png`}
            isZoomed={type === "gallery" ? true : false}
          />
        </CardBody>
      </Card>
      <Modal
        size="3xl"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {card.name} | {card.id} | {card.type}
              </ModalHeader>
              <ModalBody>
                <div className="grid gap-3 grid-cols-2">
                  <img src={`cards/${card.id}.png`} />
                  <div className="grid grid-cols-2">
                    <div>
                      {card.card_life === 0
                        ? "Cost " + card.card_cost
                        : "Life " + card.card_life}
                    </div>
                    <div>Attribute {card.attribute ? "-" : card.attribute}</div>
                    <div>Power {card.power === 0 ? "-" : card.power}</div>
                    <div>Counter {card.counter === 0 ? "-" : card.counter}</div>
                    <div>
                      Color
                      <span> {card.color.join("/")}</span>
                    </div>
                    <div> Effect</div>
                    <span>{card.text}</span>
                    <div>
                      Edition <span>{card.edition}</span>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
