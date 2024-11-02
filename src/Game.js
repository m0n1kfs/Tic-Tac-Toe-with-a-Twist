import Player from '/src/Player.js';
import RoleManager from '/src/RoleManager.js';
import GamePlan from '/src/GamePlan.js';

function showPopupMessage(message) {
    const popup = document.createElement("div");
    popup.className = "pop-up show";
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.classList.remove("show");
        document.body.removeChild(popup);
    }, 2000);
}

export default class Game {
    constructor() {
        this.players = [new Player("❌"), new Player("⭕")];
        this.currentPlayerIndex = 0;
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.roleManager = new RoleManager();
        this.gamePlan = new GamePlan();
        this.moves = [];
    }

    handleMove(row, col) {
        if (this.board[row][col] !== null) return;

        const currentPlayer = this.players[this.currentPlayerIndex];

        if (currentPlayer.moveCount >= 3) {
            showPopupMessage(`${currentPlayer.symbol} ha alcanzado el máximo de movimientos permitidos!`);
            return;
        }

        this.board[row][col] = currentPlayer.symbol;
        const role = this.roleManager.getRandomRole(currentPlayer.currentRole);
        currentPlayer.currentRole = role;
        this.moves.push({ player: currentPlayer.symbol, role, position: row * 3 + col });

        currentPlayer.incrementMove();
        this.checkWinner();
        this.switchPlayer();
    }    

    switchPlayer() {
        this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
    }

    checkWinner() {
        if (this.moves.length === 6) {
            this.showRolesButton();
        }
    }

    showRolesButton() {
        const showRolesButton = document.getElementById("show-roles-button");
        if (showRolesButton) {
            showRolesButton.style.display = "block";
        }
    }

    applyRolesAndDetermineWinners() {
        const winningMoves = [];

        for (let i = 0; i < this.moves.length; i += 2) {
            const move = this.moves[i];
            const opponentMove = this.moves[i + 1];

            if (opponentMove && move.player !== opponentMove.player) {
                const winnerRole = this.gamePlan.getWinner(move.role, opponentMove.role);

                if (winnerRole === move.role) {
                    winningMoves.push(move); // Agrega el movimiento ganador
                } else if (winnerRole === opponentMove.role) {
                    winningMoves.push(opponentMove); // Agrega el movimiento ganador del oponente
                }
            }
        }

        // Actualiza las jugadas ganadoras y el tablero
        this.moves = winningMoves;
        this.updateBoardWithRoles();
    }

    updateBoardWithRoles() {
        this.board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const position = rowIndex * 3 + colIndex;
                const move = this.moves.find(m => m.position === position);
                this.board[rowIndex][colIndex] = move ? this.gamePlan.plan[move.role].emoji : null;
            });
        });

        const resetEmojisButton = document.getElementById("reset-emojis-button");
        if (resetEmojisButton) {
            resetEmojisButton.style.display = "block";
        }
    }

    resetSymbols() {
        this.moves.forEach(move => {
            move.player = move.player === "❌" ? "X" : "O";
        });

        this.updateBoardWithSymbols();
    }

    updateBoardWithSymbols() {
        this.board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const position = rowIndex * 3 + colIndex;
                const move = this.moves.find(m => m.position === position);
                this.board[rowIndex][colIndex] = move ? move.player : null;
            });
        });

        this.recalculateMoves();
    }

    recalculateMoves() {
        const xCount = this.board.flat().filter(cell => cell === "❌" || cell === "X").length;
        const oCount = this.board.flat().filter(cell => cell === "⭕" || cell === "O").length;

        this.players[0].moveCount = xCount;
        this.players[1].moveCount = oCount;

        showPopupMessage(`Jugadas restantes permitidas - X: ${3 - xCount}, O: ${3 - oCount}`);
    }

    resetGame() {
        this.players.forEach(player => player.reset());
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.moves = [];
        this.currentPlayerIndex = 0;

        const showRolesButton = document.getElementById("show-roles-button");
        if (showRolesButton) {
            showRolesButton.style.display = "none";
        }

        const resetEmojisButton = document.getElementById("reset-emojis-button");
        if (resetEmojisButton) {
            resetEmojisButton.style.display = "none";
        }
    }
}