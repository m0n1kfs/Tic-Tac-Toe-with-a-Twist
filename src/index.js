import Game from '/src/Game.js';
import Interface from '/src/Interface.js';

document.addEventListener("DOMContentLoaded", () => {

    const game = new Game();
    const uiManager = new Interface(game);

    const newGameButton = document.getElementById("new-game-button");
    if (newGameButton) {
        newGameButton.addEventListener("click", () => {
            try {
                game.resetGame();
                uiManager.resetUI();
            } catch (error) {
            }
        });
    } else {
    }

    const showRolesButton = document.getElementById("show-roles-button");
    if (showRolesButton) {
        showRolesButton.addEventListener("click", () => {
            uiManager.processRolePairs(() => {
                uiManager.updateBoardDisplay();

                // Verificar si un jugador ganó todas las batallas
                const winner = game.checkIfPlayerWonAllBattles();
                if (winner) {
                    uiManager.displaySingleMessage(`¡${winner} ha ganado el juego!`, true);
                    game.gameOver = true;
                } else {
                    // Recalcular los contadores de movimientos
                    game.recalculateMoveCounts();
                    uiManager.updateMoveCounts();
                    uiManager.updateBoardDisplay();

                    // Verificar si hay un ganador después de eliminar fichas
                    const finalWinner = game.checkForWinner();
                    if (finalWinner) {
                        uiManager.displaySingleMessage(`¡${finalWinner} ha ganado el juego!`, true);
                        game.gameOver = true;
                    } else {
                        uiManager.hideRolesButton();
                        uiManager.updateCurrentPlayerDisplay();
                    }
                }
            });
        });
    } else {
    }
});