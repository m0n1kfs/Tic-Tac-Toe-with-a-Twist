export default class GamePlan {
    constructor() {
        this.plan = {
            piedra: {
                emoji: "🪨",
                beats: { tijera: "aplasta a la", lagarto: "machaca al" }
            },
            papel: {
                emoji: "📄",
                beats: { piedra: "envuelve a la", spock: "desautoriza a" }
            },
            tijera: {
                emoji: "✂️",
                beats: { papel: "corta a", lagarto: "decapita a" }
            },
            lagarto: {
                emoji: "🦎",
                beats: { spock: "envenena a", papel: "devora el" }
            },
            spock: {
                emoji: "🖖",
                beats: { tijera: "desintegra la", piedra: "vaporiza a la" }
            }
        };
    }
    
    checkBoardForWinner(board) {
    // Verificar filas, columnas y diagonales
    for (let i = 0; i < 3; i++) {
        // Filas
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
        // Columnas
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            return board[0][i];
        }
    }
        // Diagonales
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }
    return null; 
}

    getVictoryCounts(playerXMoves, playerOMoves) {
        const results = { xVictories: 0, oVictories: 0 };

        for (let i = 0; i < playerXMoves.length; i++) {
            const playerXMove = playerXMoves[i];
            const playerOMove = playerOMoves[i];
            const winner = this.getWinner(playerXMove, playerOMove);

            if (winner === playerXMove) {
                results.xVictories++;
                alert(`¡${playerXMove} ${this.plan[playerXMove].beats[playerOMove]} ${playerOMove}!`);
            } else {
                results.oVictories++;
                alert(`¡${playerOMove} ${this.plan[playerOMove].beats[playerXMove]} ${playerXMove}!`);
            }
        }

        return results;
    }

    getWinner(playerXMove, playerOMove) {
        if (this.plan[playerXMove]?.beats[playerOMove]) return playerXMove;
        return playerOMove;
    }
}