import { showSingleMessage, showSequentialMessages } from '/src/Popup.js';

export default class Interface {
    constructor(game) {
        this.game = game;
        this.initializeBoard();
    }

    initializeBoard() {
        const buttons = document.querySelectorAll(".tic-tac-toe-board .square");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                if (this.game.gameOver) {
                    return;
                }

                const index = parseInt(button.getAttribute("data-index"));
                const row = Math.floor(index / 3);
                const col = index % 3;

                const result = this.game.handleMove(row, col);

                if (!result.success) {
                    this.displaySingleMessage(result.message);
                    return;
                }

                this.updateSquareDisplay(button, this.game.board[row][col]);

                if (result.gameOver) {
                    this.displaySingleMessage(result.message, true);
                } else if (result.gameEnd) {
                    this.showRolesButton();
                }

                this.updateCurrentPlayerDisplay();
                this.updateMoveCounts();
            });
        });
    }

    updateSquareDisplay(button, cellValue) {
        const frontFace = button.querySelector('.square-front');
        const backFace = button.querySelector('.square-back');

        if (cellValue) {
            frontFace.textContent = cellValue; // Símbolo del jugador
            backFace.textContent = ''; // Limpiar la cara posterior
        } else {
            frontFace.textContent = '';
            backFace.textContent = '';
        }

        // Remover la clase flip si está presente
        button.classList.remove('flip');
    }

    updateBoardDisplay() {
        const buttons = document.querySelectorAll(".tic-tac-toe-board .square");
        buttons.forEach((button, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const cell = this.game.board[row][col];

            this.updateSquareDisplay(button, cell);
        });

        this.updateCurrentPlayerDisplay();
        this.updateMoveCounts();
    }

    updateBoardWithRolesForPair(moves, callback) {
        const [move1, move2] = moves;

        const flipSquares = (move, flipCallback) => {
            const button = document.querySelector(`.square[data-index='${move.position}']`);
            if (button) {
                const frontFace = button.querySelector('.square-front');
                const backFace = button.querySelector('.square-back');

                frontFace.textContent = move.player;
                backFace.textContent = this.game.gamePlan.plan[move.role].emoji;

                button.classList.add('flip');

                button.addEventListener('transitionend', () => {
                    flipCallback();
                }, { once: true });
            } else {
                flipCallback();
            }
        };

        // Flip de las dos fichas secuencialmente
        flipSquares(move1, () => {
            flipSquares(move2, () => {
                callback();
            });
        });
    }

    removeLoserPiece(loserMove, callback) {
        const button = document.querySelector(`.square[data-index='${loserMove.position}']`);
        if (button) {
            button.classList.add('disappear');
            setTimeout(() => {
                this.game.removeLoserMove(loserMove);
                this.updateSquareDisplay(button, null);
                button.classList.remove('disappear');
                callback();
            }, 500);
        } else {
            callback();
        }
    }

    flipRemainingPiecesBack(callback) {
        const buttons = document.querySelectorAll(".tic-tac-toe-board .square");
        buttons.forEach((button, index) => {
            const move = this.game.moves.find(move => move.position === index);
            if (move) {
                button.classList.remove('flip');
                const frontFace = button.querySelector('.square-front');
                const backFace = button.querySelector('.square-back');

                frontFace.textContent = move.player; // Mostrar nuevamente el símbolo del jugador
                backFace.textContent = ''; // Limpiar la cara posterior
            }
        });

        setTimeout(() => {
            if (callback) callback();
        }, 500);
    }

    processRolePairs(callback) {
        let index = 0;

        const processNextPair = () => {

            const outcome = this.game.getRolePairOutcome(index);

            if (!outcome) {
                // No hay más pares para procesar
                this.flipRemainingPiecesBack(() => {
                    if (callback) callback();
                });
                return;
            }

            if (outcome.index !== undefined) {
                index = outcome.index;
            } else {
                index += 1;
            }

            if (outcome.winnerMove || outcome.loserMove) {
                this.updateBoardWithRolesForPair([outcome.winnerMove, outcome.loserMove], () => {
                    this.showSequentialMessages([outcome.message], () => {
                        this.removeLoserPiece(outcome.loserMove, () => {
                            // Recalcular contadores de movimientos
                            this.game.recalculateMoveCounts();
                            this.updateMoveCounts();

                            // Avanzar al siguiente par
                            index++;
                            processNextPair();
                        });
                    });
                });
            } else if (outcome.message) {
                // En caso de empate
                const moves = [this.game.moves[index], this.game.moves[index + 1]];

                this.updateBoardWithRolesForPair(moves, () => {
                    this.showSequentialMessages([outcome.message], () => {
                        // Avanzar al siguiente par
                        index += 2;
                        processNextPair();
                    });
                });
            } else {
                // Continuar al siguiente par
                index++;
                processNextPair();
            }
        };

        processNextPair();
    }

    showRolesButton() {
        const showRolesButton = document.getElementById("show-roles-button");
        if (showRolesButton) {
            showRolesButton.style.display = "block";
        }
    }

    hideRolesButton() {
        const showRolesButton = document.getElementById("show-roles-button");
        if (showRolesButton) {
            showRolesButton.style.display = "none";
        }
    }

    resetUI() {
        this.updateBoardDisplay();
        this.hideRolesButton();
        const currentPlayerDisplay = document.getElementById("currentPlayer");
        currentPlayerDisplay.textContent = "¡Haz la primera jugada!";
        this.updateMoveCounts();

        // Habilitar el tablero
        const buttons = document.querySelectorAll(".tic-tac-toe-board .square");
        buttons.forEach(button => {
            button.disabled = false;
        });
    }

    updateCurrentPlayerDisplay() {
        const currentPlayerDisplay = document.getElementById("currentPlayer");
        if (!this.game.gameOver) {
            currentPlayerDisplay.textContent = `Es el turno de ${this.game.players[this.game.currentPlayerIndex].symbol}`;
        } else {
            currentPlayerDisplay.textContent = "El juego ha terminado.";
        }
    }

    updateMoveCounts() {
        const xMovesElement = document.getElementById("x-moves");
        const oMovesElement = document.getElementById("o-moves");

        const xPlayer = this.game.players.find(p => p.symbol === "❌");
        const oPlayer = this.game.players.find(p => p.symbol === "⭕");

        // Mostrar el número actual de fichas en el tablero
        xMovesElement.textContent = xPlayer.moveCount;
        oMovesElement.textContent = oPlayer.moveCount;
    }

    displaySingleMessage(message, isWinner = false) {
        showSingleMessage(message, isWinner, () => {
            if (this.game.gameOver) {
                this.disableBoard();
            }
        });
    }

    showSequentialMessages(messages, callback) {
        showSequentialMessages(messages, callback);
    }

    disableBoard() {
        const buttons = document.querySelectorAll(".tic-tac-toe-board .square");
        buttons.forEach(button => {
            button.disabled = true;
        });
    }
}