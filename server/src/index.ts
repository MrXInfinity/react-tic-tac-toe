import express, { Express, Request, Response } from "express";
const { createServer } = require('node:http');
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
const io = new Server(3000,{
  cors: {
    origin: ["http://localhost:5173"]
  }
});

let gameData = Array(9).fill(null);
let currentUser: any = null
let currentValue = "X"

function checkIfWon(val: string, index: number) {
  let win = false
  // consecutive for each row (0-2) / (3-5) / (6-8)
  // same each col (0, 3, 6) / (1, 4, 7) / (2, 5, 8)
  // diagonal (0, 4, 8) / (2, 4, 6)

  gameData.map((eachData) => {
    const firstcol = 
    if (index === 4) {
      if (val === gameData[0] && val === gameData[8]) return win = true
      if (val === gameData[2] && val === gameData[6]) return win = true
    }
    if (val === gameData[Math.ceil(index /3)]) return win = true
    if (val === gameData[Math.ceil(9 /3)])
  })
}


io.on('connection', (socket) => {
  console.log('a user connected', socket.id, gameData);

  socket.on("token", (session: any) => {
    if (!currentUser) {
      io.emit("updateToken")
    }
      currentUser = session
  })
  

  socket.on("add-mark", (index: number, session: any) => {
    console.log(index)
    if (currentUser !== session) {
      console.log(currentUser, session)
      currentUser = session
      gameData[index] = currentValue
      currentValue = currentValue === "X" ? "O" : "X"
      io.emit("update", gameData)
    }
    
  })

  socket.on("reset", () => {
      gameData = Array(9).fill(null)
      io.emit("update", gameData)
  })
});