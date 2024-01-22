import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [gameBoard, setGameBoard] = useState(Array(9).fill(null));
  const [isUsersTurn, setIsUsersTurn] = useState(false);

  const socket = io("http://localhost:3000");
  const sessionId = useRef(uuidv4());

  const changeUsersTurn = (val: boolean) => {
    setIsUsersTurn(val);
  };

  const addMark = (index: number) => {
    if (!gameBoard[index]) {
      socket.emit("add-mark", index, sessionId.current);
      changeUsersTurn(false);
      console.log("added mark");
    }
  };

  const updateBoard = (updatedArr: any[]) => {
    setGameBoard(updatedArr);
    changeUsersTurn(true);
  };

  const updateToken = () => {
    setIsUsersTurn(true);
  };

  const restart = () => {
    socket.emit("reset");
  };

  const addSession = () => {
    socket.emit("token", sessionId.current);
  };

  useEffect(() => {
    socket.on("connect", addSession);
    socket.on("update", updateBoard);
    socket.on("updateToken", updateToken);

    return () => {
      socket.off("update", updateBoard);
      socket.off("disconnect", addSession);
      socket.off("updateToken", updateToken);
    };
  }, []);

  console.log(isUsersTurn, sessionId.current);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h1>React Tic Tac Toe</h1>

      <div className="grid grid-cols-3">
        {gameBoard.map((val, index) => (
          <div
            onClick={isUsersTurn ? () => addMark(index) : undefined}
            className="h-10 w-10 border-2 border-black"
          >
            {val}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={restart}
      >
        Restart
      </button>
    </div>
  );
}

export default App;
