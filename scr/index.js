// Initialize players and variables
const players = ['X', 'O'];
let count = 0;
let currentPlayer = players[0];
let playerMovesCount = { X: 0, O: 0 }; // Track the number of moves for each player
const startNewGame = document.getElementById("reset-button");
startNewGame.addEventListener("click", startGame);

const buttons = document.querySelectorAll(".tic-tac-toe-board button");
let game = Array.from({ length: 3 }, () => Array(3).fill(null));
let board = Array.from({ length: 3 }, () => Array(3).fill(null));

buttons.forEach((button, index) => {
   button.addEventListener("click", (e) => handlePlayer(e, index));
});

// Handle player moves
function handlePlayer(e, index) {
   if (playerMovesCount[currentPlayer] >= 3) {
       alert(`${currentPlayer} has already made 3 moves!`);
       return; 
   }

   count++;
   e.target.textContent = currentPlayer;
   e.target.disabled = true;

   const row = Math.floor(index / 3);
   const column = index % 3;
   game[row][column] = currentPlayer;
   board[row][column] = e.target;

   playerMovesCount[currentPlayer]++; 

   const winningCombination = currentPlayerWin();

   if (winningCombination) {
       document.getElementById("currentPlayer").textContent = `${currentPlayer} won!`;
       setWinner(winningCombination);
   } else if (count === 9) {
       updateUi(true);
   } else {
       switchPlayer();
   }
}

// Check for winning combinations
function currentPlayerWin() {
   // Check rows
   for (let i = 0; i < 3; i++) {
       if (game[i][0] === currentPlayer && game[i][1] === currentPlayer && game[i][2] === currentPlayer) {
           return [[i, 0], [i, 1], [i, 2]];
       }
   }
   // Check columns
   for (let j = 0; j < 3; j++) {
       if (game[0][j] === currentPlayer && game[1][j] === currentPlayer && game[2][j] === currentPlayer) {
           return [[0, j], [1, j], [2, j]];
       }
   }
   // Check diagonals
   if (game[0][0] === currentPlayer && game[1][1] === currentPlayer && game[2][2] === currentPlayer) {
       return [[0, 0], [1, 1], [2, 2]];
   }
   if (game[0][2] === currentPlayer && game[1][1] === currentPlayer && game[2][0] === currentPlayer) {
       return [[0, 2], [1, 1], [2, 0]];
   }
   return null; 
}

// Define winner
function setWinner(winningCombination) {
   winningCombination.forEach(([row, col]) => {
       board[row][col].classList.add("highlight");
   });
}

// Switch player turn
function switchPlayer() {
   currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
   updateUi();
}

// Update UI
function updateUi(draw = false) {
   const currentPlayerTurn = document.getElementById("currentPlayer");
   currentPlayerTurn.textContent = draw ? "No one won" : `${currentPlayer}'s turn`;
}

// Start new game
function startGame() {
   buttons.forEach((button) => {
       button.textContent = "";
       button.disabled = false;
   });

   game = Array.from({ length: 3 }, () => Array(3).fill(null));
   board = Array.from({ length: 3 }, () => Array(3).fill(null));
   currentPlayer = players[0];
   count = 0;
   playerMovesCount = { X: 0, O: 0 }; 
   updateUi();
}