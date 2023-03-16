import {
    EnemyDOMController,
    InfoDOMController,
  } from "./DOMControllers.js";
  import { Enemy, Statistics } from "./entities.js";
  import { ProgressBarController } from "./bars.js";
  
  import enemyController from "./gameControllers/enemyController.js";
  import levelController from "./gameControllers/levelController.js";
  import shopController from "./gameControllers/shopController.js";
  import timeController from "./gameControllers/timeController.js";

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
  
      this.stats = new Statistics();
  
      this.enemyController = new enemyController(this);
      this.levelController = new levelController(this);
      this.shopController = new shopController(this);
      this.timeController = new timeController(this);

      window.test = () => {
        this.timeController.updateTimePlayed()
        console.log(this.timeController.getTimePlayedString());
      }
  
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
    }
  
    onMoneyChange() {
      this.infoDOM.updateMoneyBar(this.money);
      this.shopController.updateUnitsAviability();
    }
  }

  export default Game;