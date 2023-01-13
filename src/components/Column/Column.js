import Card from "components/Card/Card";
import ConfirmModal from "components/Common/ConfirmModal";
import { useLayoutEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { BiPlus } from "react-icons/bi";
import { Container, Draggable } from "react-smooth-dnd";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import {
  SaveContentAfterPressEnter,
  selectAllInLineText,
} from "utilities/ContentEditable";
import { mapOrder } from "utilities/sorts";
import "./Column.scss";
const Column = ({ column, onCardDrop, onUpdateColumn }) => {
  const cards = mapOrder(column.cards, column.cardOrder, "id");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);
  const onConfirmModalAction = (type) => {
    console.log(type);
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      };
      onUpdateColumn(newColumn);
    }
    setShowConfirmModal(false);
  };
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);

  const [columnTitle, setColumnTitle] = useState("");
  useLayoutEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);
  const handleColumnBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    onUpdateColumn(newColumn);
  };

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="column-title-editable"
            onChange={handleColumnTitleChange}
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInLineText}
            onMouseDown={(e) => e.preventDefault()}
            onKeyDown={SaveContentAfterPressEnter}
            onBlur={handleColumnBlur}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            />
            <Dropdown.Menu>
              <Dropdown.Item>Add card</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>
                Remove Column
              </Dropdown.Item>
              <Dropdown.Item>Remove all card</Dropdown.Item>
              <Dropdown.Item>Archive all card</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
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
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove ${column.title}! All related cards will also be removed!`}
      />
    </div>
  );
};

export default Column;
