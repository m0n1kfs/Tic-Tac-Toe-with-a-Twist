export default class GamePlan {
    constructor() {
        this.plan = {
            "roca": {
                emoji: "🪨",
                beats: {
                    "tijera": "aplasta",
                    "lagarto": "aplasta"
                }
            },
            "papel": {
                emoji: "📄",
                beats: {
                    "roca": "envuelve",
                    "spock": "desautoriza"
                }
            },
            "tijera": {
                emoji: "✂️",
                beats: {
                    "papel": "corta",
                    "lagarto": "decapita"
                }
            },
            "lagarto": {
                emoji: "🦎",
                beats: {
                    "papel": "devora",
                    "spock": "envenena"
                }
            },
            "spock": {
                emoji: "🖖",
                beats: {
                    "tijera": "rompe",
                    "roca": "vaporiza"
                }
            }
        };
        this.roles = Object.keys(this.plan);
    }

    getRandomRole(currentRole) {
        const availableRoles = this.roles.filter(role => role !== currentRole);
        const randomIndex = Math.floor(Math.random() * availableRoles.length);
        const role = availableRoles[randomIndex];
        return role;
    }

    getWinner(role1, role2) {

        if (!this.plan[role1] || !this.plan[role2]) {
            return null;
        }

        if (role1 === role2) {
            return null;
        }
        if (this.plan[role1].beats[role2]) {
            return role1;
        }
        if (this.plan[role2].beats[role1]) {
            return role2;
        }
        return null;
    }

    checkBoardForWinner(board) {
        const lines = [
            // Filas
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            // Columnas
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            // Diagonales
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]],
        ];

        for (const line of lines) {
            if (line[0] && line[0] === line[1] && line[1] === line[2]) {
                return line[0];
            }
        }
        return null;
    }
}