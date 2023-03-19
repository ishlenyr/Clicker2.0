class audioController {
    constructor(game) {
        this.game = game;
        this.backgroundMusic = new Audio('../audio/MainTheme.mp3');
        this.backgroundMusic.loop = 'loop';


        const playBackmusic = () => {
            this.backgroundMusic.volume = this.musicVolume
            this.backgroundMusic.play();
            document.removeEventListener('click', playBackmusic);
        }
        document.addEventListener('click', playBackmusic);
    }

    get musicVolume() {
        return this.game.settings.muteSounds === true ?
            0 : this.game.settings.musicVolume / 100;
    }

    get effectVolume() {
        return this.game.settings.muteSounds === true ?
            0 : this.game.settings.effectVolume / 100;
    }

    playSoundIndependently(soundName) {
        const sound = new Audio(`../audio/${soundName}`);
        sound.volume = this.effectVolume;
        sound.play();
    }

    updateMusicVolume() {
        this.backgroundMusic.volume = this.musicVolume;
    }
}

export default audioController;