export default class GamePlan {
    constructor() {
        this.plan = {
            roca: {
                emoji: "🪨",
                beats: {
                    tijera: "aplasta",
                    lagarto: "aplasta"
                }
            },
            papel: {
                emoji: "📄",
                beats: {
                    roca: "envuelve",
                    spock: "refuta"
                }
            },
            tijera: {
                emoji: "✂️",
                beats: {
                    papel: "corta",
                    lagarto: "decapita"
                }
            },
            lagarto: {
                emoji: "🦎",
                beats: {
                    papel: "devora",
                    spock: "envenena"
                }
            },
            spock: {
                emoji: "🖖",
                beats: {
                    tijera: "desintegra",
                    roca: "vaporiza"
                }
            }
        };

        this.roles = Object.keys(this.plan);
    }

    getRandomRole(excludeRole) {
        const roles = this.roles.filter(role => role !== excludeRole);
        const randomIndex = Math.floor(Math.random() * roles.length);
        return roles[randomIndex];
    }

    getWinner(role1, role2) {
        if (role1 === role2) {
            console.log(`Empate entre roles: ${role1} y ${role2}`);
            return null;
        }

        if (this.plan[role1].beats[role2]) {
            console.log(`${role1} vence a ${role2}`);
            return role1;
        } else if (this.plan[role2].beats[role1]) {
            console.log(`${role2} vence a ${role1}`);
            return role2;
        } else {
            console.log(`No se pudo determinar el ganador entre ${role1} y ${role2}`);
            return null;
        }
    }

    checkBoardForWinner(board) {
        // Verificar filas
        for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return board[i][0];
            }
        }

        // Verificar columnas
        for (let i = 0; i < 3; i++) {
            if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return board[0][i];
            }
        }

        // Verificar diagonales
        if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return board[0][0];
        }

        if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return board[0][2];
        }

        // No hay ganador
        return null;
    }
}