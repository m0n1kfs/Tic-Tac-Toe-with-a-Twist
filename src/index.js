import Game from '/src/Game.js';
import Interface from '/src/Interface.js';

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    const uiManager = new Interface(game);

    // Inicializa el tablero
    uiManager.updateUI();

    // Resetear el juego
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
});