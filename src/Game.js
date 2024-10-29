import Player from '/src/Player.js';
import RoleManager from '/src/RoleManager.js';
import GamePlan from '/src/GamePlan.js';

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
            alert(`${currentPlayer.symbol} ha alcanzado el máximo de movimientos permitidos!`);
            return;
        }

        this.board[row][col] = currentPlayer.symbol;
        const role = this.roleManager.getRandomRole(currentPlayer.currentRole);
        currentPlayer.currentRole = role;
        this.moves.push({ player: currentPlayer.symbol, role });

        currentPlayer.incrementMove();
        this.checkWinner();
        this.switchPlayer();
    }

    switchPlayer() {
        this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
    }

    checkWinner() {
        const winner = this.gamePlan.checkBoardForWinner(this.board);
        if (winner) {
            alert(`¡El ganador es ${winner}!`);
            this.resetGame();
        } else if (this.isBoardFull()) {
            alert("Empate. ¡Muestra los roles!");
            this.showRolesButton();
            this.resetGame();
        }
    }

    showRolesButton() {
        const showRolesButton = document.getElementById("showRolesButton");
        if (showRolesButton) {
            showRolesButton.style.display = "block";
        }
    }
    
    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== null));
    }

    resetGame() {
        this.players.forEach(player => player.reset());
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.moves = [];
        this.currentPlayerIndex = 0;
        const showRolesButton = document.getElementById("showRolesButton");
        if (showRolesButton) {
            showRolesButton.style.display = "none";
        }
    }    
}