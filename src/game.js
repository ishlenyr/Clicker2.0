import { EnemyDOMController, InfoDOMController } from "./DOMControllers.js";
import { Enemy } from "./entities.js";
import { ProgressBarController } from "./bars.js";

import autoClickController from "./gameControllers/autoClickController.js";
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
      ticksPlayed: 0,
      enemiesKilled: 0,
    };

    this.globalStats = {
      totalEnemyClicks: 0,
      ticksPlayed: 0,
      enemiesKilled: 0,
      sessions: 1
    }

    this.settings = {
      theme: undefined,
      muteSounds: false,
      brightness: 0,
      musicVolume: 50,
      effectVolume: 50,
    };
    this.money = 0;

    this.saleLoadController = new saleLoadController(this);
    this.enemyController = new enemyController(this);
    this.levelController = new levelController(this);
    this.shopController = new shopController(this);
    this.timeController = new timeController(this);
    this.audioController = new audioController(this);
    this.autoClickController = new autoClickController(this);

    this.enemyDOM = new EnemyDOMController();
    this.enemyDOM.setClickListener(
      this.enemyController.hitEnemy.bind(this.enemyController)
    );

    this.infoDOM = new InfoDOMController();
    this.levelBar = new ProgressBarController(
      document.getElementById("levelBar")
    );

    this.saleLoadController.loadSettings();
    this.bindToSettings();
    this.bindButtonToAutoClick();
    document.getElementById('play-again-button').addEventListener('click', () => {
      this.newGame();
      this.saleLoadController.startAutoSave();
    });

    if (this.saleLoadController.isSaveSlotExists("autosave")) {
      this.saleLoadController.loadGame("autosave");
      this.updateAllVisuals();
    } else {
      this.levelController.changeLevel(this.currentLevel);
      this.infoDOM.updateAttackBar(this.damage);
      this.onMoneyChange();
    }
    this.saleLoadController.startAutoSave();
  }

  showWinDialog() {
    this.saleLoadController.stopAutoSave();
    document.getElementById('play-time').textContent = this.timeController.getTimePlayedString();
    document.getElementById('clicks').textContent = this.stats.totalEnemyClicks;
    document.getElementById('enemies-killed').textContent = this.stats.enemiesKilled;
    document.getElementById('statistics-dialog').showModal();
  }

  newGame() {
    this.currentLevel = 1;
    this.levelController.changeLevel(this.currentLevel);
    this.money = 0;
    this.damage = 10;
    this.stats.ticksPlayed = 0;
    this.stats.totalEnemyClicks = 0;
    this.stats.enemiesKilled = 0;
    this.globalStats.sessions++;
    this.shopController.resetUnits();
    this.updateAllVisuals();
  }

  bindButtonToAutoClick() {
    let enabled = false;
    document.addEventListener('keydown', (event) => {
      if (event.code != 'KeyT') return;
      if (enabled) {
        document.getElementById('auto-click-label').classList.remove('auto-click-appear');
        enabled = false;
        this.autoClickController.disableEnemyAutoClick();

      }
      else {
        enabled = true;
        document.getElementById('auto-click-label').classList.add('auto-click-appear');
        this.autoClickController.enableEnemyAutoClick();
      }
    });
  }

  loadGame(saveSlot) {
    this.timeController.resetTimestamp();
    this.saleLoadController.loadGame(saveSlot);
    this.updateAllVisuals();
  }

  loadGameByString(string) {
    this.timeController.resetTimestamp();
    this.saleLoadController.loadGameFromString(string);
    this.updateAllVisuals();
  }

  saveGame(saveSlot) {
    this.saleLoadController.saveGame(saveSlot);
  }

  updateAllVisuals() {
    this.levelBar.setText(`Level ${this.currentLevel}`);
    this.levelBar.setProgress(
      (this.enemiesKilled / this.enemiesOnLevel) * 100.0
    );
    this.infoDOM.updateMoneyBar(this.money);
    this.infoDOM.updateAttackBar(this.damage);
    this.shopController.updateUnits();
    this.shopController.updateUnitsAviability();
    this.enemyDOM.update(this.enemy);
    this.enemyDOM.show();
  }

  bindToSettings() {
    const musicVolumeSlider = document.getElementById("volume-music-input");
    musicVolumeSlider.value = this.settings.musicVolume;
    musicVolumeSlider.oninput = ({ target }) => {
      this.settings.musicVolume = target.value;
      this.audioController.updateMusicVolume();
    };

    const effectsVolumeSlider = document.getElementById("volume-effects-input");
    effectsVolumeSlider.value = this.settings.effectVolume;
    effectsVolumeSlider.oninput = ({ target }) => {
      this.settings.effectVolume = target.value;
      this.audioController.updateMusicVolume();
    };

    const saveButton = document.getElementById("save-settings-button");
    saveButton.addEventListener("click", () => {
      this.saleLoadController.saveSettings();
    });

    const muteCheckbox = document.getElementById("mute-checkbox");
    muteCheckbox.checked = this.settings.muteSounds;
    muteCheckbox.onchange = () => {
      this.settings.muteSounds = muteCheckbox.checked;
      this.audioController.updateMusicVolume();
    };

    const themeCheckbox = document.getElementById("theme-checkbox");
    themeCheckbox.addEventListener("change", () => {
      document.body.classList.toggle("dark");
      this.settings.theme = this.settings.theme === "light" ? "dark" : "light";
    });

    if (!this.settings.theme) {
      const isDarkThemePreferred = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      themeCheckbox.checked = isDarkThemePreferred;
      this.settings.theme = isDarkThemePreferred ? "dark" : "light";
      if (isDarkThemePreferred) {
        document.body.classList.add("dark");
      }
    } else {
      const isDarkTheme = this.settings.theme === "dark";
      themeCheckbox.checked = isDarkTheme;
      isDarkTheme && document.body.classList.add("dark");
    }

    const brightnessSlider = document.getElementById("brightness-input");
    const brightnessOverlay = document.getElementById("brightness-overlay");
    brightnessOverlay.style.backgroundColor = `rgba(0, 0, 0, ${this.settings.brightness})`;
    brightnessSlider.value = 100 - this.settings.brightness * 100;
    brightnessSlider.addEventListener("change", () => {
      const val =
        1 - (brightnessSlider.value === 1 ? 0.9 : brightnessSlider.value / 100);
      console.log(val);
      this.settings.brightness = val;
      brightnessOverlay.style.backgroundColor = `rgba(0, 0, 0, ${val})`;
    });
  }

  onMoneyChange() {
    this.infoDOM.updateMoneyBar(this.money);
    this.shopController.updateUnitsAviability();
  }
}

export default Game;
