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

    updateUI(showRoles = false) {
        const currentPlayerDisplay = document.getElementById("currentPlayer");
        currentPlayerDisplay.textContent = `Es el turno de ${this.game.players[this.game.currentPlayerIndex].symbol}`;
        
        const buttons = document.querySelectorAll(".tic-tac-toe-board button");
        buttons.forEach((button, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const cell = this.game.board[row][col];
                
            if (showRoles && cell) {
                const move = this.game.moves.find(m => m.player === cell && m.position === index);
                button.textContent = move ? this.game.gamePlan.plan[move.role].emoji : cell;
                button.classList.add("flip");  
            } else {
                button.textContent = cell || "";
                button.classList.remove("flip"); 
            }
        });
    }    
}