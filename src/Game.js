import GamePlan from '/src/GamePlan.js';

class Player {
    constructor(symbol) {
        this.symbol = symbol;
        this.moveCount = 0;
        this.currentRole = null;
    }

    incrementMove() {
        this.moveCount++;
    }

    decrementMove() {
        if (this.moveCount > 0) {
            this.moveCount--;
        } else {
        }
    }

    reset() {
        this.moveCount = 0;
        this.currentRole = null;
    }
}

export default class Game {
    constructor() {
        this.players = [new Player("❌"), new Player("⭕")];
        this.currentPlayerIndex = 0;
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.gamePlan = new GamePlan();
        this.moves = [];
        this.gameOver = false;
    }

    handleMove(row, col) {
        try {
            if (!this.isMoveValid(row, col)) {
                return { success: false, message: "Este movimiento no es válido" };
            }

            const currentPlayer = this.players[this.currentPlayerIndex];

            if (currentPlayer.moveCount >= 3) {
                console.warn(`${currentPlayer.symbol} ha alcanzado el máximo de movimientos`);
                return { success: false, message: `¡${currentPlayer.symbol} ha alcanzado el máximo de movimientos permitidos!` };
            }

            const role = this.gamePlan.getRandomRole(currentPlayer.currentRole);
            currentPlayer.currentRole = role;

            this.makeMove(row, col, currentPlayer);

            const winner = this.checkForWinner();
            if (winner) {
                this.gameOver = true;
                return { success: true, gameOver: true, winner: winner, message: `¡${winner} ha ganado el juego!` };
            }

            const gameEnd = this.checkForGameEnd();
            if (gameEnd) {
                return { success: true, gameEnd: true };
            }

            this.switchPlayer();
            return { success: true };
        } catch (error) {
            console.error("Error al realizar el movimiento:", error);
            return { success: false, message: "Ha ocurrido un error al realizar el movimiento. Inténtalo de nuevo." };
        }
    }

    isMoveValid(row, col) {
        if (this.board[row][col] !== null || this.gameOver) {
            console.warn(`Movimiento en (${row}, ${col}) no es válido`);
            return false;
        }
        return true;
    }

    makeMove(row, col, player) {
        this.board[row][col] = player.symbol;
        this.moves.push({ player: player.symbol, role: player.currentRole, position: row * 3 + col });
        player.incrementMove();
    }

    checkForWinner() {
        const winner = this.gamePlan.checkBoardForWinner(this.board);
        if (winner) {
            return winner;
        }
        return null;
    }

    checkForGameEnd() {
        const totalMoves = this.players.reduce((sum, player) => sum + player.moveCount, 0);
        if (totalMoves >= 6 && !this.gameOver) {
            return true;
        }
        return false;
    }

    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }

    removeLoserMove(loserMove) {
        const { position } = loserMove;
        const row = Math.floor(position / 3);
        const col = position % 3;

        if (this.board[row][col] === null) {
            return;
        }

        this.board[row][col] = null;
        this.moves = this.moves.filter(move => move !== loserMove);

        const player = this.players.find(p => p.symbol === loserMove.player);
        if (player) {
            player.decrementMove();
        }
    }

    checkIfPlayerWonAllBattles() {
        const survivingPlayers = new Set(this.moves.map(move => move.player));
        if (survivingPlayers.size === 1) {
            const winner = Array.from(survivingPlayers)[0];
            return winner;
        }
        return null;
    }

    recalculateMoveCounts() {
        this.players.forEach(player => {
            const movesOnBoard = this.moves.filter(move => move.player === player.symbol).length;
            player.moveCount = movesOnBoard;
        });
    }

    resetGame() {
        this.players.forEach(player => player.reset());
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.moves = [];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
    }

    getRolePairOutcome(index) {
        if (index >= this.moves.length - 1) {
            return null;
        }

        const move = this.moves[index];
        const opponentMove = this.moves[index + 1];

        if (move && opponentMove && move.player !== opponentMove.player) {
            const winnerRole = this.gamePlan.getWinner(move.role, opponentMove.role);

            if (winnerRole) {
                const winnerMove = winnerRole === move.role ? move : opponentMove;
                const loserMove = winnerRole === move.role ? opponentMove : move;
                const action = this.gamePlan.plan[winnerRole].beats[loserMove.role];
                const message = `¡${this.gamePlan.plan[winnerRole].emoji} ${action} ${this.gamePlan.plan[loserMove.role].emoji}! Por tanto, gana ${winnerMove.player}.`;
                const loserIndex = index + (loserMove === opponentMove ? 1 : 0);
                return { winnerMove, loserMove, loserIndex, message, index };
            } else {
                const message = `Empate entre ${this.gamePlan.plan[move.role].emoji} y ${this.gamePlan.plan[opponentMove.role].emoji}. Ambos permanecen en el tablero.`;
                return { message, index: index + 2 };
            }
        } else {
            return { index: index + 1 };
        }
    }
}