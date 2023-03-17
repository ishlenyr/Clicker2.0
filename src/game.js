import {
  EnemyDOMController,
  InfoDOMController,
} from "./DOMControllers.js";
import { Enemy } from "./entities.js";
import { ProgressBarController } from "./bars.js";

import enemyController from "./gameControllers/enemyController.js";
import levelController from "./gameControllers/levelController.js";
import shopController from "./gameControllers/shopController.js";
import timeController from "./gameControllers/timeController.js";
import saleLoadController from "./gameControllers/saveLoadController.js";
import audioController from "./gameControllers/audioController.js";

// Serves as main context for all objects and contains game logic
class Game {
  constructor() {
    this.damage = 10;
    this.enemy = new Enemy();

    this.currentLevel = 1;
    this.enemiesOnLevel = 0;
    this.enemiesKilled = 0;
    this.enemyHealthMultiplier = 1;
    this.enemyIndexPool = [];

    this.stats = {
      totalEnemyClicks: 0,
      ticksPlayed: 0
    };

    this.settings = {
      theme: 'dark',
      muteSounds: false,
      brightness: 50,
      musicVolume: 50,
      effectVolume: 50,
    }

    this.enemyController = new enemyController(this);
    this.levelController = new levelController(this);
    this.shopController = new shopController(this);
    this.timeController = new timeController(this);
    this.saleLoadController = new saleLoadController(this);
    this.audioController = new audioController(this);
    this.saleLoadController.loadSettings();

    this.enemyDOM = new EnemyDOMController();
    this.enemyDOM.setClickListener(this.enemyController.hitEnemy.bind(this.enemyController));

    this.infoDOM = new InfoDOMController();
    this.infoDOM.updateAttackBar(this.damage);
    this.levelBar = new ProgressBarController(
      document.getElementById("levelBar")
    );

    this.levelController.changeLevel(this.currentLevel);

    this.money = 0;
    this.onMoneyChange();

    this.bindToSettings();

  }

  bindToSettings() {
    const musicVolumeSlider = document.getElementById('volume-music-input');
    musicVolumeSlider.value = this.settings.musicVolume;
    musicVolumeSlider.oninput = ({ target }) => {
      this.settings.musicVolume = target.value;
      this.audioController.updateMusicVolume();
    }

    const effectsVolumeSlider = document.getElementById('volume-effects-input');
    effectsVolumeSlider.value = this.settings.effectVolume;
    effectsVolumeSlider.oninput = ({ target }) => {
      this.settings.effectVolume = target.value;
      this.audioController.updateMusicVolume();
    }

    const saveButton = document.getElementById('save-settings-button');
    saveButton.onclick = () => {
      this.saleLoadController.saveSettings();
    }

    const muteCheckbox = document.getElementById('mute-checkbox');
    muteCheckbox.checked = this.settings.muteSounds;
    muteCheckbox.onchange = () => {
      this.settings.muteSounds = muteCheckbox.checked;
      this.audioController.updateMusicVolume();
    }
  }

  onMoneyChange() {
    this.infoDOM.updateMoneyBar(this.money);
    this.shopController.updateUnitsAviability();
  }
}

export default Game;