import { showPopupMessages } from '/src/PopUp.js';

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
        for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return board[i][0];
            }
            if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return board[0][i];
            }
        }
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
        const messages = [];

        for (let i = 0; i < playerXMoves.length; i++) {
            const playerXMove = playerXMoves[i];
            const playerOMove = playerOMoves[i];
            const winner = this.getWinner(playerXMove, playerOMove);

            if (winner === playerXMove) {
                results.xVictories++;
                messages.push(`¡${this.plan[playerXMove].emoji} ${this.plan[playerXMove].beats[playerOMove]} ${this.plan[playerOMove].emoji}!`);
            } else if (winner === playerOMove) {
                results.oVictories++;
                messages.push(`¡${this.plan[playerOMove].emoji} ${this.plan[playerOMove].beats[playerXMove]} ${this.plan[playerXMove].emoji}!`);
            } else {
                messages.push("¡Empate entre roles!");
            }
        }

        showPopupMessages(messages);
        return results;
    }

    getWinner(playerXMove, playerOMove) {
        if (!this.plan[playerXMove] || !this.plan[playerOMove]) return null;

        if (this.plan[playerXMove]?.beats[playerOMove]) {
            return playerXMove;
        } else if (this.plan[playerOMove]?.beats[playerXMove]) {
            return playerOMove;
        }
        return null; // Empate
    }
}