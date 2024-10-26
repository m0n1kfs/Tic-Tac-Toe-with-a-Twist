const players = ["X", "O"]; 
let count = 0;
let currentPlayer = players[0]; 
let playerMovesCount = { X: 0, O: 0 }; // Count of moves
const moves = []; // Storage for moves
const startNewGame = document.getElementById("new-game-button");
startNewGame.addEventListener("click", startGame);

const showRolesButton = document.getElementById("show-roles-button");
showRolesButton.style.display = "none"; // Hidden for now

const buttons = document.querySelectorAll(".tic-tac-toe-board button");
let game = Array.from({ length: 3 }, () => Array(3).fill(null));
let board = Array.from({ length: 3 }, () => Array(3).fill(null));

buttons.forEach((button, index) => {
  button.addEventListener("click", (e) => handlePlayer(e, index));
});

// Limit of moves per player
function handlePlayer(e, index) {
    if (playerMovesCount[currentPlayer] >= 3) {
        alert(`¡${currentPlayer} ha llegado al máximo de movimientos permitidos!`);
        return; 
    }

    count++;
    e.target.textContent = currentPlayer;
    e.target.disabled = true;

    const row = Math.floor(index / 3);
    const column = index % 3;
    game[row][column] = currentPlayer;
    board[row][column] = e.target;

    // Assign role per move
    const role = getRandomRole();
    moves.push({ player: currentPlayer, role: role }); 

    playerMovesCount[currentPlayer]++; 

    // Winning combinations
    const winningCombination = currentPlayerWin();
    if (winningCombination) {
        document.getElementById("currentPlayer").textContent = `¡${currentPlayer} ha ganado!`;
        setWinner(winningCombination);
        buttons.forEach((button) => {
            button.disabled = true; // Disable buttons when a player wins
        });
    } else if (count === 6) {
        showRolesButton.style.display = "block"; // Show the button on the sixth move
    } else if (count === 9) {
        processRPSLS(); // Assuming this function is defined elsewhere
    } else {
        switchPlayer();
    }
}

showRolesButton.addEventListener("click", displayRoles);

function displayRoles() {
  const gamePlan = {
      piedra: ["tijera", "lagarto"],
      papel: ["piedra", "spock"],
      tijera: ["papel", "lagarto"],
      lagarto: ["spock", "papel"],
      spock: ["tijera", "piedra"]
  };

  // Inicializa el array para dar seguimiento a los resultados
  const results = [];
  
  // Itera entre pares de jugadas
  for (let i = 0; i < moves.length; i += 2) {
      const player1 = moves[i];
      const player2 = moves[i + 1];
      
      // Se segura de que hay jugadas en pares
      if (player2) {
          let winner;
          if (gamePlan[player1.role].includes(player2.role)) {
              winner = player1; 
          } else if (gamePlan[player2.role].includes(player1.role)) {
              winner = player2; 
          }

          if (winner) {
              // Añade al ganador
              results.push(`La jugada ${i + 1} (${player1.role}) gana a la jugada ${i + 2} (${player2.role}) - ${winner.player} gana`);
          } else {
              results.push(`La jugada ${i + 1} (${player1.role}) empata con la jugada ${i + 2} (${player2.role})`);
          }
      }
  }

  // Alerta del resultado
  alert(results.join('\n'));

  // Elimina las jugadas perdedoras
  for (let i = 0; i < moves.length; i += 2) {
      const player1 = moves[i];
      const player2 = moves[i + 1];

      if (player2) {
          if (gamePlan[player1.role].includes(player2.role)) {
              // Elimina la X y O perdedoras
              player2.role = "";
          } else if (gamePlan[player2.role].includes(player1.role)) {
              player1.role = "";
          }
      }
  }
}

function currentPlayerWin() {
    // Rows
    for (let i = 0; i < 3; i++) {
        if (game[i][0] === currentPlayer && game[i][1] === currentPlayer && game[i][2] === currentPlayer) {
            return [[i, 0], [i, 1], [i, 2]];
        }
    }
    // Columns
    for (let j = 0; j < 3; j++) {
        if (game[0][j] === currentPlayer && game[1][j] === currentPlayer && game[2][j] === currentPlayer) {
            return [[0, j], [1, j], [2, j]];
        }
    }
    // Diagonal
    if (game[0][0] === currentPlayer && game[1][1] === currentPlayer && game[2][2] === currentPlayer) {
        return [[0, 0], [1, 1], [2, 2]];
    }
    if (game[0][2] === currentPlayer && game[1][1] === currentPlayer && game[2][0] === currentPlayer) {
        return [[0, 2], [1, 1], [2, 0]];
    }
    return null; 
}

function setWinner(winningCombination) {
    winningCombination.forEach(([row, col]) => {
        board[row][col].classList.add("highlight");
    });
}

function switchPlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    updateUi();
}

function updateUi(draw = false) {
    const currentPlayerTurn = document.getElementById("currentPlayer");
    currentPlayerTurn.textContent = draw ? "No one won" : `Es el turno de ${currentPlayer}`;
}

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
    moves.length = 0; // Clear the moves array
    showRolesButton.style.display = "none"; 
    updateUi();
}

// Ensure the same role is not assigned consecutively
function getRandomRole() {
    const roles = ["rock", "paper", "scissors", "lizard", "spock"];
    let role;
    do {
        role = roles[Math.floor(Math.random() * roles.length)];
    } while (moves.length > 0 && moves[moves.length - 1].role === role);
    return role;
}