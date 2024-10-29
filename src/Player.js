export default class Player {
    constructor(symbol) {
        this.symbol = symbol;         
        this.moveCount = 0;          
        this.currentRole = null;     
    }

    incrementMove() {
        this.moveCount++;             
    }

    reset() {
        this.moveCount = 0;           
        this.currentRole = null;     
    }
}
