class saleLoadController {
    constructor(game) {
        this.game = game;
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
}

export default saleLoadController;