import Card from "components/Card/Card";
import { BiPlus } from "react-icons/bi";
import { Container, Draggable } from "react-smooth-dnd";
import { mapOrder } from "utilities/sorts";
import "./Column.scss";
const Column = ({ column, onCardDrop }) => {
  const cards = mapOrder(column.cards, column.cardOrder, "id");

  return (
    <div className="column">
      <header className="column-drag-handle">{column.title}</header>
      <div className="card-list">
        <Container
          groupName="col"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "card-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <BiPlus />
          Add another card
        </div>
      </footer>
    </div>
  );
};

export default Column;
