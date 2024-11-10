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
            console.warn(`El contador de movimientos de ${this.symbol} ya está en cero.`);
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
            if (this.gameOver) {
                return { success: false, message: "El juego ha terminado" };
            }
    
            let currentPlayer = this.players[this.currentPlayerIndex];
    
            // Verifica si el jugador actual ya alcanzó el máximo de movimientos
            if (currentPlayer.moveCount >= 3) {
                console.warn(`${currentPlayer.symbol} ha alcanzado el máximo de movimientos en el tablero`);
    
                // Verifica si el otro jugador puede realizar un movimiento
                const otherPlayerIndex = 1 - this.currentPlayerIndex;
                const otherPlayer = this.players[otherPlayerIndex];
    
                if (otherPlayer.moveCount < 3) {
                    // Cambia el turno al otro jugador
                    this.currentPlayerIndex = otherPlayerIndex;
                    currentPlayer = this.players[this.currentPlayerIndex];
                    console.log(`Es el turno de ${currentPlayer.symbol}`);
    
                    // Intenta nuevamente con el nuevo jugador
                    return this.handleMove(row, col);
                } else {
                    // Ambos jugadores han alcanzado el máximo de movimientos
                    console.log("Ambos jugadores han alcanzado el máximo de movimientos. Debes procesar los roles.");
                    return { success: false, message: "Ambos jugadores han alcanzado el máximo de movimientos. Debes procesar los roles." };
                }
            }
    
            if (!this.isMoveValid(row, col)) {
                return { success: false, message: "Este movimiento no es válido" };
            }
    
            const role = this.gamePlan.getRandomRole(currentPlayer.currentRole);
            currentPlayer.currentRole = role;
    
            console.log(`Jugador ${currentPlayer.symbol} seleccionó el rol ${role}`);
    
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
        console.log(`Movimiento realizado por ${player.symbol} en posición (${row}, ${col}) con rol ${player.currentRole}`);
    }

    checkForWinner() {
        const winner = this.gamePlan.checkBoardForWinner(this.board);
        if (winner) {
            console.log(`¡${winner} ha ganado!`);
            return winner;
        }
        return null;
    }

    checkForGameEnd() {
        const totalMoves = this.players.reduce((sum, player) => sum + player.moveCount, 0);
        const maxTotalMoves = this.players.length * 3; // 6 movimientos máximos en total
        if (totalMoves >= maxTotalMoves && !this.gameOver) {
            console.log("Se han alcanzado los movimientos máximos, es hora de procesar los roles.");
            return true;
        }
        return false;
    }

    checkForGameOverAfterBattles() {
        const winner = this.checkIfPlayerWonAllBattles();
        if (winner) {
            this.gameOver = true;
            console.log(`¡${winner} ha ganado el juego después de las batallas!`);
            return winner;
        }
        return null;
    }

    switchPlayer() {
        this.currentPlayerIndex = 1 - this.currentPlayerIndex;
        console.log(`Es el turno de ${this.players[this.currentPlayerIndex].symbol}`);
    }

    removeLoserMove(loserMove) {
        const { position } = loserMove;
        const row = Math.floor(position / 3);
        const col = position % 3;

        if (this.board[row][col] === null) {
            console.warn(`No hay ficha en la posición (${row}, ${col}) para eliminar.`);
            return;
        }

        this.board[row][col] = null;
        this.moves = this.moves.filter(move => move !== loserMove);

        const player = this.players.find(p => p.symbol === loserMove.player);
        if (player) {
            player.decrementMove();
            console.log(`Ficha de ${loserMove.player} eliminada de la posición (${row}, ${col})`);
        }
    }

    checkIfPlayerWonAllBattles() {
        const survivingPlayers = new Set(this.moves.map(move => move.player));
        if (survivingPlayers.size === 1) {
            const winner = Array.from(survivingPlayers)[0];
            console.log(`¡${winner} ha ganado todas las batallas!`);
            return winner;
        }
        return null;
    }

    recalculateMoveCounts() {
        this.players.forEach(player => {
            const movesOnBoard = this.moves.filter(move => move.player === player.symbol).length;
            player.moveCount = movesOnBoard;
            console.log(`Contador de movimientos recalculado para ${player.symbol}: ${player.moveCount}`);
        });
    }

    resetGame() {
        this.players.forEach(player => player.reset());
        this.board = Array.from({ length: 3 }, () => Array(3).fill(null));
        this.moves = [];
        this.currentPlayerIndex = 0;
        this.gameOver = false;
        console.log("Juego reiniciado.");
    }

    getRolePairOutcome(index, processedPositions) {
        const move1 = this.moves[index];

        if (!move1 || processedPositions.has(move1.position)) {
            // Si el movimiento ya ha sido procesado o no existe, pasamos al siguiente
            return { nextIndex: index + 1 };
        }

        // Buscar el siguiente movimiento del jugador contrario que no haya sido procesado
        for (let i = index + 1; i < this.moves.length; i++) {
            const move2 = this.moves[i];

            if (
                move1.player !== move2.player &&
                !processedPositions.has(move2.position)
            ) {
                console.log(
                    `Procesando par de movimientos: ${move1.player} (${move1.role}) vs ${move2.player} (${move2.role})`
                );

                const winnerRole = this.gamePlan.getWinner(move1.role, move2.role);

                if (winnerRole) {
                    const winnerMove = winnerRole === move1.role ? move1 : move2;
                    const loserMove = winnerMove === move1 ? move2 : move1;
                    const action =
                        this.gamePlan.plan[winnerRole].beats[loserMove.role];
                    const message = `¡${this.gamePlan.plan[winnerRole].emoji} ${action} ${this.gamePlan.plan[loserMove.role].emoji}! Por tanto, gana ${winnerMove.player}.`;

                    // Marcamos las posiciones como procesadas
                    processedPositions.add(move1.position);
                    processedPositions.add(move2.position);

                    return {
                        winnerMove,
                        loserMove,
                        message,
                        nextIndex: index + 1, // Avanzamos al siguiente movimiento
                    };
                } else {
                    const message = `Empate entre ${this.gamePlan.plan[move1.role].emoji} y ${this.gamePlan.plan[move2.role].emoji}. Ambos permanecen en el tablero.`;

                    // Marcamos las posiciones como procesadas
                    processedPositions.add(move1.position);
                    processedPositions.add(move2.position);

                    return {
                        message,
                        move1,
                        move2,
                        nextIndex: index + 1,
                    };
                }
            }
        }

        // No se encontró un movimiento del jugador contrario, avanzamos el índice
        return { nextIndex: index + 1 };
    }
}