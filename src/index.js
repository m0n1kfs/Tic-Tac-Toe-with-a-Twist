import Game from '/src/Game.js';
import Interface from '/src/Interface.js';

const game = new Game();
const gameInterface = new Interface(game);

document.getElementById('new-game-button').addEventListener('click', () => {
    game.resetGame();
    gameInterface.resetUI();
});

document.getElementById('show-roles-button').addEventListener('click', () => {
    gameInterface.hideRolesButton();
    gameInterface.processRolePairs(() => {
        // Después de procesar los roles, verificamos si hay un ganador en el tablero
        const winner = game.checkForWinner();
        if (winner) {
            game.gameOver = true;
            gameInterface.displaySingleMessage(`¡${winner} ha ganado el juego!`, true);
            gameInterface.disableBoard();
        } else {
            // También verificamos si un jugador ha ganado todas las batallas
            const battleWinner = game.checkIfPlayerWonAllBattles();
            if (battleWinner) {
                game.gameOver = true;
                gameInterface.displaySingleMessage(`¡${battleWinner} ha ganado el juego!`, true);
                gameInterface.disableBoard();
            }
        }
    });
});