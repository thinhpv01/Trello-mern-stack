import { createNewCard, updateColumn } from "actions/apiCall";
import Card from "components/Card/Card";
import ConfirmModal from "components/Common/ConfirmModal";
import { cloneDeep } from "lodash";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { BiPlus, BiX } from "react-icons/bi";
import { Container, Draggable } from "react-smooth-dnd";
import { MODAL_ACTION_CONFIRM } from "utilities/constants";
import {
  SaveContentAfterPressEnter,
  selectAllInLineText,
} from "utilities/ContentEditable";
import { mapOrder } from "utilities/sorts";
import "./Column.scss";
const Column = ({ column, onCardDrop, onUpdateColumnState }) => {
  const cards = mapOrder(column.cards, column.cardOrder, "_id");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);
  const [columnTitle, setColumnTitle] = useState("");
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const newCardTextAreaRef = useRef(null);

  // Remove column
  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = { ...column, _destroy: true };
      updateColumn(newColumn._id, newColumn).then((updatedColumn) => {
        onUpdateColumnState(updatedColumn);
      });
    }
    toggleShowConfirmModal();
  };
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm);
  };
  useLayoutEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);
  useEffect(() => {
    if (newCardTextAreaRef && newCardTextAreaRef.current) {
      newCardTextAreaRef.current.focus();
      newCardTextAreaRef.current.select();
    }
  }, [openNewCardForm]);
  const handleColumnBlur = () => {
    if (columnTitle !== column.title) {
      const newColumn = {
        ...column,
        title: columnTitle,
      };
      updateColumn(newColumn._id, newColumn).then((updatedColumn) => {
        updatedColumn.cards = newColumn.cards;
        onUpdateColumnState(updatedColumn);
      });
    }
  };
  const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value);
  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextAreaRef.current.focus();
      return;
    }
    const newCardToAdd = {
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim(),
    };
    createNewCard(newCardToAdd).then((card) => {
      let newColumn = cloneDeep(column);
      newColumn.cards.push(card);
      newColumn.cardOrder.push(newCardToAdd._id);
      onUpdateColumnState(newColumn);
      setNewCardTitle("");
      toggleOpenNewCardForm();
    });
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
              <Dropdown.Item onClick={toggleOpenNewCardForm}>
                Add card
              </Dropdown.Item>
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
          onDrop={(dropResult) => onCardDrop(column._id, dropResult)}
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
        {openNewCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              size="sm"
              as="textarea"
              rows={3}
              placeholder="Enter a title for dis card..."
              className="textarea-enter-new-card"
              ref={newCardTextAreaRef}
              onChange={onNewCardTitleChange}
              value={newCardTitle}
              onKeyDown={(e) => e.key === "Enter" && addNewCard()}
            />
            <Button variant="success" size="sm" onClick={addNewCard}>
              Add New Card
            </Button>
            <BiX className="cancel-icon" onClick={toggleOpenNewCardForm} />
          </div>
        )}
      </div>
      <footer>
        {!openNewCardForm && (
          <div className="footer-actions" onClick={toggleOpenNewCardForm}>
            <BiPlus />
            Add another card
          </div>
        )}
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
