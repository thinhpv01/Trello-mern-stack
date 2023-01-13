import { initialData } from "actions/initialData";
import Column from "components/Column/Column";
import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container as BootstrapContainer,
  Form,
  Row,
} from "react-bootstrap";
import { BiPlus, BiX } from "react-icons/bi";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "utilities/dragDrop";
import { mapOrder } from "utilities/sorts";
import "./BoardContent.scss";

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const newColumnInputRef = useRef(null);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardFromDB) {
      setBoard(boardFromDB);
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnForm]);

  if (isEmpty(board)) {
    return <div className="not-found">Board not found</div>;
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult);
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];
      let currentColumn = newColumns.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i.id);
      setColumns(newColumns);
    }
  };

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };
  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

  const addNewColumn = () => {
    if (!newColumnTitle) {
      return;
    }
    const newColumnToAdd = {
      id: Math.random().toString(36),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };
    console.log(newColumnToAdd);
    let newColumns = [...columns, newColumnToAdd];
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.column = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle("");
  };
  const onUpdateColumn = (newColumnToUpdate) => {
    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i.id === newColumnToUpdate.id
    );
    if (newColumnToUpdate._destroy) {
      // remove column
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      // update column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  };

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "column-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
      </Container>
      <BootstrapContainer>
        {openNewColumnForm ? (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title..."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                onChange={onNewColumnTitleChange}
                value={newColumnTitle}
                onKeyDown={(e) => e.key === "Enter" && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>
                Add Column
              </Button>
              <BiX
                className="cancel-new-column"
                onClick={() => setOpenNewColumnForm(false)}
              />
            </Col>
          </Row>
        ) : (
          <div className="add-new-column" onClick={toggleOpenNewColumnForm}>
            <BiPlus />
            Add another card
          </div>
        )}
      </BootstrapContainer>
    </div>
  );
};

export default BoardContent;
