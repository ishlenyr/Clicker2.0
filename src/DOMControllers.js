/* ---- DOMControllers.js ---
   Everything that interacts with DOM objects
   Does not contain any game logic            */

import { ProgressBarController } from "./bars.js";
import * as helper from "./helpers.js";

export { EnemyDOMController, UnitDOMController, InfoDOMController };

const style = getComputedStyle(document.body);
const deathAnimDelay = helper.cssDelayToNumber(
  style.getPropertyValue("--death-anim-delay")
);

const enemyHealthBar = new ProgressBarController(
  document.getElementById("enemyHealthBar")
);

const enemyImage = document.getElementById('enemyImage');
const enemyName = document.getElementById('enemyName');
const enemyHealthBarText = document.getElementById('enemyHealthBarText');
class EnemyDOMController {
  game;
  constructor({ game }) {
    this.game = game;

    enemyImage.onclick = this.game.hitEnemy.bind(game);
    this.update();
  }

  playHitAnim() {
    enemyImage.classList.remove("hit-anim");
    enemyImage.offsetWidth;
    enemyImage.classList.add("hit-anim");
  }

  playDeathAnim() {
    enemyImage.classList.add("death-anim");
    setTimeout(() => {
      enemyImage.classList.remove("death-anim");
    }, deathAnimDelay);
    return deathAnimDelay;
  }

  hide() {
    enemyImage.style.visibility= 'hidden';
    enemyImage.style.pointerEvents = 'none';
  }

  update() {
    this.updateEnemyHealthBar();
    this.updateEnemyName();
    this.updateEnemyImage();

    enemyImage.classList.remove("hit-anim");
    enemyImage.classList.remove("death-anim");
  }

  updateEnemyImage() {
    enemyImage.src = `img/${this.game.enemy.name}.png`;
  }

  updateEnemyName() {
    enemyName.textContent = this.game.enemy.name;
  }

  updateEnemyHealthBar() {
    enemyHealthBarText.textContent = `${this.game.enemy.health}/${this.game.enemy.maxHealth}`;
    enemyHealthBar.setProgress(
      (this.game.enemy.health / this.game.enemy.maxHealth) * 100
    );
  }
}

class UnitDOMController {
  constructor({ game, element, unit, unitIndex }) {
    this.element = element;
    this.unit = unit;
    this.game = game;
    this.unitIndex = unitIndex;

    this.element.onclick = this.buy.bind(this);

    const name = this.element.getElementsByClassName("shop-item-name")[0];
    name.textContent = this.unit.name;

    const attack = this.element.getElementsByClassName("shop-item-attack")[0];
    attack.textContent = this.unit.damage;

    this.updateCount();
    this.updateCost();
  }

  buy() {
    this.game.buyUnit(this.unitIndex);
  }

  updateCost() {
    const price = this.element.getElementsByClassName("shop-item-price")[0];
    price.textContent = Number(this.unit.cost);
  }

  updateCount() {
    const count = this.element.getElementsByClassName("shop-item-count")[0];
    count.textContent = this.unit.count;
  }

  updateAvaliability() {
    if (this.game.money < this.unit.cost) {
      this.element.classList.add("shop-item-disabled");
    } else {
      this.element.classList.remove("shop-item-disabled");
    }
  }
}

const moneyBar = document.getElementById('moneyBar');
const attackBar = document.getElementById('attackBar');
class InfoDOMController {
  updateMoneyBar(money) {
    moneyBar.textContent = money;
  }
  updateAttackBar(attack) {
    attackBar.textContent = attack;
  }
}
