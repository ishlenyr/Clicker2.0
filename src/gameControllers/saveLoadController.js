class saleLoadController {
    constructor(game) {
        this.game = game;

        setInterval(() => {
            this.saveGame('autosave');
        }, 60000);
    }

    saveSettings() {
        const saveString = `
        ${this.game.settings.theme === 'dark' ? 1 : 0}|
        ${this.game.settings.muteSounds === true ? 1 : 0}|
        ${this.game.settings.brightness}|
        ${this.game.settings.musicVolume}|
        ${this.game.settings.effectVolume}`.replace(/[\s]*/g, '');
        localStorage.setItem('settings', btoa(saveString));
    }

    loadSettings() {
        const encodedString = localStorage.getItem('settings');
        if (encodedString === null) return;
        const data = atob(encodedString).split('|');
        this.game.settings.theme = data[0] === '1' ? 'dark' : 'light';
        this.game.settings.muteSounds = data[1] === '1' ? true : false;
        this.game.settings.brightness = Number(data[2]);
        this.game.settings.musicVolume = Number(data[3]);
        this.game.settings.effectVolume = Number(data[4]);
    }

    saveGame(saveSlot) {
        localStorage.setItem(saveSlot, this.getSaveString());
    }

    isSaveSlotExists(saveSlot) {
        return localStorage.getItem(saveSlot) !== null;
    }

    getSaveSlotData(saveSlot) {
        const encodedString = localStorage.getItem(saveSlot);
        if (encodedString === null) return;
        const data = atob(encodedString).split('|');
        return {
            level: Number(data[4]),
            time: this.game.timeController.getTimePlayedString(Number(data[18]))
        }
    }

    getSaveString() {
        this.game.timeController.updateTimePlayed();
        const saveString = `
        ${this.game.damage}|
        ${this.game.enemy.health}|
        ${this.game.enemy.maxHealth}|
        ${btoa(this.game.enemy.name)}|
        ${this.game.currentLevel}|
        ${this.game.enemiesOnLevel}|
        ${this.game.enemiesKilled}|
        ${this.game.enemyHealthMultiplier}|
        ${btoa(JSON.stringify(this.game.enemyIndexPool))}|
        ${this.game.money}|
        ${this.game.shopController.units[0].entity.count}|
        ${this.game.shopController.units[1].entity.count}|
        ${this.game.shopController.units[2].entity.count}|
        ${this.game.shopController.units[3].entity.count}|
        ${this.game.shopController.units[4].entity.count}|
        ${this.game.shopController.units[5].entity.count}|
        ${this.game.shopController.units[6].entity.count}|
        ${this.game.stats.totalEnemyClicks}|
        ${this.game.stats.ticksPlayed}`.replace(/[\s]*/g, '');
        return btoa(saveString);
    }

    loadGame(saveSlot) {
        const encodedString = localStorage.getItem(saveSlot);
        if (encodedString === null) return;
        this.loadGameFromString(encodedString);
    }

    loadGameFromString(encodedString) {
        const data = atob(encodedString).split('|');
        let index = 0;
        this.game.damage = Number(data[index++]);
        this.game.enemy.health = Number(data[index++]);
        this.game.enemy.maxHealth = Number(data[index++]);
        this.game.enemy.name = atob(data[index++]);
        this.game.currentLevel = Number(data[index++]);
        this.game.enemiesOnLevel = Number(data[index++]);
        this.game.enemiesKilled = Number(data[index++]);
        this.game.enemyHealthMultiplier = Number(data[index++]);
        this.game.enemyIndexPool = JSON.parse(atob(data[index++]));
        this.game.money = Number(data[index++]);
        for (let unitIndex = 0; unitIndex < 7; unitIndex++) {
            this.game.shopController.units[unitIndex].entity.count = Number(data[index++]);
        }
        this.game.stats.totalEnemyClicks = Number(data[index++]);
        this.game.stats.ticksPlayed = Number(data[index++]);
    }
}

export default saleLoadController;