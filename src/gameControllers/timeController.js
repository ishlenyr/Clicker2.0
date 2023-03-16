function pad2(number) {
    number = '0' + number;
    return number.substr(number.length - 2);
}

class timeController {
    constructor(game) {
        this.timestamp = new Date();
        this.game = game;
    }
    updateTimePlayed() {
        const newTimestamp = new Date()
        this.game.stats.ticksPlayed += newTimestamp - this.timestamp;
        this.timestamp = newTimestamp;
    }
    getTimePlayedString() {
        const seconds = Math.floor(this.game.stats.ticksPlayed / 1000);
        const hour = Math.floor(seconds / 3600);
        const minute = Math.floor((seconds / 60) % 60);
        const second = seconds % 60;

        return `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
    }
}

export default timeController;