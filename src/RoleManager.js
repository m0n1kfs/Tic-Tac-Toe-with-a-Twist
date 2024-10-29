export default class RoleManager {
    constructor() {
        this.roles = ["piedra", "papel", "tijera", "lagarto", "spock"]; 
    }

    getRandomRole(excludeRole) {
        let newRole;
        let attempts = 0;

        do {
            newRole = this.roles[Math.floor(Math.random() * this.roles.length)]; 
            attempts++;
        } while (newRole === excludeRole && attempts < 3); 

        return attempts < 3 ? newRole : excludeRole; 
    }
}
