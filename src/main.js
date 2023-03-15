import {
  EnemyDOMController,
  UnitDOMController,
  InfoDOMController,
} from "./DOMControllers.js";
import { Unit, Enemy } from "./entities.js";
import { ProgressBarController } from "./bars.js";
import unitTypes from "./sets/unitTypes.js";
import enemyTypes from "./sets/enemyTypes.js";
import levels from "./sets/levels.js";

// Serves as main context for all objects and contains game logic
class Game {
  constructor() {
    this.damage = 10;
    this.units = [];
    this.enemy = new Enemy();
    this.currentLevel = 1;
    this.enemiesOnLevel = 0;
    this.enemiesKilled = 0;
    this.enemyHealthMultiplier = 1;
    this.enemyIndexPool = [];

    this.enemyDOM = new EnemyDOMController({ game: this });
    this.infoDOM = new InfoDOMController();
    this.infoDOM.updateAttackBar(this.damage);
    this.levelBar = new ProgressBarController(
      document.getElementById("levelBar")
    );

    this.changeLevel(this.currentLevel);

    // bind controller to every unit type
    for (let i = 0; i < unitTypes.length; i++) {
      const unit = new Unit(unitTypes[i]);
      const element = document.getElementById(unit.id);
      this.units.push({
        entity: unit,
        controller: new UnitDOMController({
          game: this,
          element,
          unit,
          unitIndex: i,
        }),
      });
    }

    this.money = 0;
    this.onMoneyChange();
  }

  onMoneyChange() {
    this.infoDOM.updateMoneyBar(this.money);
    this.units.forEach((x) => x.controller.updateAvaliability());
  }
  
  changeLevel(level) {
    this.currentLevel = level;
    this.enemyHealthMultiplier = levels[level - 1].healthMultiplier;

    this.enemiesKilled = 0;
    this.enemiesOnLevel = 0;

    // update level bar
    this.levelBar.setText(`Level ${level}`);
    this.levelBar.setProgress(0);

    // fill enemy pool with new enemies
    levels[level - 1].enemies.forEach((e) => {
      const enemyTypeIndex = enemyTypes.findIndex((x) => x.id === e.id);
      for (let index = 0; index < e.count; index++) {
        this.enemyIndexPool.push(enemyTypeIndex);
        this.enemiesOnLevel++;
      }
    });

    this.changeEnemyToNext(); // update once we're done
  }

  changeEnemyToNext() {
    if (this.enemyIndexPool.length === 0) {
      this.changeLevel(++this.currentLevel);
    }
    this.enemy.change(
      enemyTypes[this.enemyIndexPool.pop()],
      this.enemyHealthMultiplier
    );
    this.enemyDOM.update();
  }

  hitEnemy() {
    const remainingHelath = this.enemy.health;
    this.enemy.hit(this.damage);
    this.enemyDOM.updateEnemyHealthBar();

    if (this.enemy.health <= 0) {
      const delay = this.enemyDOM.playDeathAnim();
      this.money += this.enemy.maxHealth + remainingHelath;
      this.onMoneyChange();

      setTimeout(() => {
        this.enemiesKilled++;
        this.levelBar.setProgress(
          (this.enemiesKilled / this.enemiesOnLevel) * 100.0
        );
        if (this.currentLevel === 10) {
          this.enemyDOM.hide();
          alert("You won!");
          return;
        }
        this.changeEnemyToNext();
      }, delay);
    } else {
      this.money += this.damage;
      this.onMoneyChange();
      this.enemyDOM.playHitAnim();
    }
  }

  buyUnit(index) {
    if (this.units[index].entity.cost <= this.money) {
      this.money -= this.units[index].entity.cost;
      this.units[index].entity.count++;
      this.onMoneyChange();

      this.damage += this.units[index].entity.damage;
      this.infoDOM.updateAttackBar(this.damage);
      this.units[index].controller.updateCost();
      this.units[index].controller.updateCount();
    }
  }
}

const myGame = new Game();

const settingsDialog = document.getElementById("settings-dialog");
const openModalBtn = document.getElementById("open-settings");
openModalBtn?.addEventListener("click", () => {
  settingsDialog?.showModal();
});
