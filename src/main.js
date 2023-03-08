// @ts-check
import {
  EnemyDOMController,
  UnitDOMController,
  InfoDOMController,
} from "./DOMControllers.js";
import { enemyTypes, unitTypes, Unit, Enemy } from "./entities.js";

// Serves as main context for all objects and contains game logic
class Game {
  #money;
  constructor() {
    this.damage = 10;
    this.units = [];
    this.enemy = new Enemy(enemyTypes[0]);
    this.enemyDOM = new EnemyDOMController({ game: this });
    this.infoDOM = new InfoDOMController();

    this.infoDOM.updateMoneyBar(this.money);
    this.infoDOM.updateAttackBar(this.damage);

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
  }

  set money(value) {
    this.#money = value;
    this.infoDOM.updateMoneyBar(this.money);
    this.units.forEach((x) => x.controller.updateAvaliability());
  }
  get money() {
    return this.#money;
  }

  hitEnemy() {
    const remainingHelath = this.enemy.health;
    this.enemy.hit(this.damage);
    this.enemyDOM.updateEnemyHealthBar();

    if (this.enemy.health <= 0) {
      const delay = this.enemyDOM.playDeathAnim();
      this.money += this.enemy.maxHealth + remainingHelath;
      setTimeout(() => {
        this.enemy.change(enemyTypes[0]);
        this.enemyDOM.updateEnemy();
      }, delay);
    } else {
      this.money += this.damage;
      this.enemyDOM.playHitAnim();
    }
  }

  buyUnit(index) {
    if (this.units[index].entity.cost <= this.money) {
      this.money -= this.units[index].entity.cost;
      this.units[index].entity.count++;

      this.damage += this.units[index].entity.damage;
      this.infoDOM.updateAttackBar(this.damage);
      this.units[index].controller.updateCost();
      this.units[index].controller.updateCount();
    }
  }
}

const myGame = new Game();
