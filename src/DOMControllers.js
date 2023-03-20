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

const enemyImage = document.getElementById("enemyImage");
const enemyName = document.getElementById("enemyName");
class EnemyDOMController {
  setClickListener(callback) {
    enemyImage.onmousedown = callback;
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
    enemyImage.style.visibility = "hidden";
    enemyImage.style.pointerEvents = "none";
  }

  show() {
    enemyImage.style.visibility = null;
    enemyImage.style.pointerEvents = null;
  }

  update(enemy) {
    this.updateEnemyHealthBar(enemy);
    this.updateEnemyName(enemy);
    this.updateEnemyImage(enemy);

    enemyImage.classList.remove("hit-anim");
    enemyImage.classList.remove("death-anim");
  }

  updateEnemyImage(enemy) {
    enemyImage.src = `src/img/${enemy.name}.svg`;
  }

  updateEnemyName(enemy) {
    enemyName.textContent = enemy.name;
  }

  updateEnemyHealthBar(enemy) {
    enemyHealthBar.setText(`${enemy.health}/${enemy.maxHealth}`);
    enemyHealthBar.setProgress((enemy.health / enemy.maxHealth) * 100);
  }
}

class UnitDOMController {
  constructor({ element, unit, unitIndex }) {
    this.element = element;
    this.unit = unit;
    this.unitIndex = unitIndex;

    const name = this.element.getElementsByClassName("shop-item-name")[0];
    name.textContent = this.unit.name;

    const attack = this.element.getElementsByClassName("shop-item-attack")[0];
    attack.textContent = this.unit.damage;

    this.updateCount();
    this.updateCost();
  }

  setClickListener(callback) {
    this.element.onclick = () => {
      callback(this.unitIndex);
    };
  }

  updateCost() {
    const price = this.element.getElementsByClassName("shop-item-price")[0];
    price.textContent = Number(this.unit.cost);
  }

  updateCount() {
    const count = this.element.getElementsByClassName("shop-item-count")[0];
    count.textContent = this.unit.count;
  }

  updateAvaliability(money) {
    if (this.unit.cost <= money) {
      this.element.classList.remove("shop-item-disabled");
    } else {
      this.element.classList.add("shop-item-disabled");
    }
  }
}

const moneyBar = document.getElementById("moneyBar");
const attackBar = document.getElementById("attackBar");
class InfoDOMController {
  constructor() {
    this.oldMoney = Number(moneyBar.textContent);
    this.oldAttack = Number(attackBar.textContent);
  }
  updateMoneyBar(money) {
    moneyBar.textContent = money;
    this.playChangeAnim(moneyBar, money, this.oldMoney);
    this.oldMoney = money;
  }
  updateAttackBar(attack) {
    attackBar.textContent = attack;
    this.playChangeAnim(attackBar, attack, this.oldAttack);
    this.oldAttack = attack;
  }

  playChangeAnim(element, a, b) {
    if (a > b) {
      element.classList.remove("grow-anim");
      element.classList.remove("shrink-anim");
      element.offsetWidth;
      element.classList.add("grow-anim");
    }
    else if (a < b) {
      element.classList.remove("grow-anim");
      element.classList.remove("shrink-anim");
      element.offsetWidth;
      element.classList.add("shrink-anim");
    }
  }
}
