import AppBar from "components/AppBar/AppBar";
import BoardBar from "components/BoardBar/BoardBar";
import BoardContent from "components/BoardContent/BoardContent";
import "./App.scss";
function App() {
  const text = "Xin lỗi!";
  for (let i = 0; i <= 1001; i++) {
    console.log(text);
  }
  return (
    <div className="trello">
      <AppBar />
      <BoardBar />
      <BoardContent />
    </div>
  );
}

export default App;
