import Game from '/src/Game.js';
import Interface from '/src/Interface.js';
import { showPopupMessages } from '/src/PopUp.js';

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    const uiManager = new Interface(game);

    uiManager.updateUI();

    const newGameButton = document.getElementById("new-game-button");
    if (newGameButton) {
        newGameButton.addEventListener("click", () => {
            try {
                game.resetGame();
                uiManager.updateUI();
            } catch (error) {
                console.error("Error al reiniciar el juego:", error);
            }
        });
    }

    const showRolesButton = document.getElementById("show-roles-button");
    if (showRolesButton) {
        showRolesButton.addEventListener("click", async () => {
            for (let i = 0; i < game.moves.length; i += 2) {
                const move = game.moves[i];
                const opponentMove = game.moves[i + 1];

                if (opponentMove && move.player !== opponentMove.player) {
                    uiManager.updateUI(true);

                    const moveButton = document.querySelector(`.square[data-index="${move.position}"]`);
                    const opponentButton = document.querySelector(`.square[data-index="${opponentMove.position}"]`);
                    moveButton.classList.add("darkened");
                    opponentButton.classList.add("darkened");

                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const winnerRole = game.gamePlan.getWinner(move.role, opponentMove.role);
                    const winnerMove = winnerRole === move.role ? move : opponentMove;
                    const loserMove = winnerRole === move.role ? opponentMove : move;
                    const action = game.gamePlan.plan[winnerRole].beats[loserMove.role];

                    await new Promise(resolve => {
                        showPopupMessages([
                            `¡${game.gamePlan.plan[winnerRole].emoji} ${action} ${game.gamePlan.plan[loserMove.role].emoji}! Por tanto, gana ${winnerMove.player}.`
                        ]);
                        resolve();
                    });

                    moveButton.classList.remove("darkened");
                    opponentButton.classList.remove("darkened");
                }
            }

            game.moves = game.moves.filter((move, index) => {
                const opponentMove = game.moves[index % 2 === 0 ? index + 1 : index - 1];
                return move.role === game.gamePlan.getWinner(move.role, opponentMove?.role);
            });

            game.board.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    const position = rowIndex * 3 + colIndex;
                    const move = game.moves.find(m => m.position === position);
                    game.board[rowIndex][colIndex] = move ? move.player : null;
                });
            });

            uiManager.updateUI(true);

            showRolesButton.style.display = "none";
            document.getElementById("reset-emojis-button").style.display = "block"; // Muestra el botón de reset
        });
    }

    const resetEmojisButton = document.getElementById("reset-emojis-button");
    if (resetEmojisButton) {
        resetEmojisButton.addEventListener("click", () => {
            game.resetSymbols(); // Resetea los emojis a "X" y "O"
            uiManager.updateUI();  // Actualiza la interfaz
            resetEmojisButton.style.display = "none"; // Oculta el botón nuevamente
        });
    }
});