// script.js
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let vsComputer = false;
let scores = { X: 0, O: 0 };

const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");

const clickSound = new Audio("Background/Click Sound.mp3");
const winSound = new Audio("Background/game-win.mp3");
const drawSound = new Audio("Background/draw.mp3");  

function initializeBoard() {
  boardElement.innerHTML = "";
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  messageElement.textContent = `Player ${currentPlayer}'s Turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    boardElement.appendChild(cell);
  }
}

function handleCellClick(event) {
  const index = event.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  clickSound.play();
  event.target.classList.add("active-cell");

  if (checkWinner()) {
    messageElement.textContent = `Player ${currentPlayer} Wins!`;
    scores[currentPlayer]++;
    updateScores();
    winSound.play();
    gameActive = false;
    return;
  } else if (board.every(cell => cell !== "")) {
    messageElement.textContent = "It's a Draw!";
    drawSound.play();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  messageElement.textContent = `Player ${currentPlayer}'s Turn`;

  if (vsComputer && currentPlayer === "O" && gameActive) {
    setTimeout(minimaxComputerMove, 500);
  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function resetBoard() {
  currentPlayer = "X";
  initializeBoard();
}

function playWithComputer() {
  vsComputer = true;
  resetBoard();
}

function playWithHuman() {
  vsComputer = false;
  resetBoard();
}

function updateScores() {
  scoreXElement.textContent = scores.X;
  scoreOElement.textContent = scores.O;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(i => i !== null);

  if (checkWin(newBoard, "X")) {
    return { score: -10 };
  } else if (checkWin(newBoard, "O")) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      let result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      let result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWin(testBoard, player) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return testBoard[a] === player && testBoard[b] === player && testBoard[c] === player;
  });
}

function minimaxComputerMove() {
  const bestSpot = minimax([...board], "O").index;
  const cell = document.querySelector(`.cell[data-index='${bestSpot}']`);
  handleCellClick({ target: cell });
}

// Initialize the board on page load
initializeBoard();
