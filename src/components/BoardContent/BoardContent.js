import { createNewColumn, fetchBoardDetails } from "actions/apiCall";
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
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const newColumnInputRef = useRef(null);

  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  };

  useEffect(() => {
    const boardId = "63ddc16686eca5f8bbe92077";
    fetchBoardDetails(boardId).then((board) => {
      setBoard(board);
      setColumns(mapOrder(board.columns, board.columnOrder, "_id"));
    });
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
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];
      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i._id);
      setColumns(newColumns);
    }
  };

  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim(),
    };
    createNewColumn(newColumnToAdd).then((column) => {
      let newColumns = [...columns, column];
      let newBoard = { ...board };
      newBoard.columnOrder = newColumns.map((c) => c._id);
      newBoard.column = newColumns;

      setColumns(newColumns);
      setBoard(newBoard);
      setNewColumnTitle("");
    });
  };
  const onUpdateColumnState = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id;
    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i._id === columnIdToUpdate
    );
    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }
    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c._id);
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
              onUpdateColumnState={onUpdateColumnState}
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
                className="cancel-icon"
                onClick={() => setOpenNewColumnForm(false)}
              />
            </Col>
          </Row>
        ) : (
          <div className="add-new-column" onClick={toggleOpenNewColumnForm}>
            <BiPlus />
            Add another column
          </div>
        )}
      </BootstrapContainer>
    </div>
  );
};

export default BoardContent;
