export default class Interface {
    constructor(game) {
        this.game = game;
        this.initializeBoard();
    }

    initializeBoard() {
        const buttons = document.querySelectorAll(".tic-tac-toe-board .square");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const index = parseInt(button.getAttribute("data-index"));
                const row = Math.floor(index / 3);
                const col = index % 3;

                this.game.handleMove(row, col);
                this.updateUI();
            });
        });
    }

    updateUI() {
        // Muestra el turno del jugador actual
        const currentPlayerDisplay = document.getElementById("currentPlayer");
        currentPlayerDisplay.textContent = `Es el turno de ${this.game.players[this.game.currentPlayerIndex].symbol}`;
    
        // Actualiza el estado de cada botón del tablero en función del estado del juego
        const buttons = document.querySelectorAll(".tic-tac-toe-board button");
        buttons.forEach((button, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            button.textContent = this.game.board[row][col] || ""; // Muestra el símbolo o vacío
        });
    }    
}