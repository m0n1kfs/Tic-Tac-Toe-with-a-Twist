export default class RoleManager {
    constructor() {
        this.roles = ["piedra", "papel", "tijera", "lagarto", "spock"];
    }

    getRandomRole(excludeRole) {
        let newRole;
        do {
            newRole = this.roles[Math.floor(Math.random() * this.roles.length)];
        } while (newRole === excludeRole);
        return newRole;
    }
}