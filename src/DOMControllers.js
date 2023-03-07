/* ---- DOMControllers.js ---
   Everything that interacts with DOM objects
   Does not contain any game logic            */

import { setBarFill } from './bars.js';
import * as helper from './helpers.js';

export { EnemyDOMController, UnitDOMController, InfoDOMController };

const style = getComputedStyle(document.body);
const deathAnimDelay = helper.cssDelayToNumber(style.getPropertyValue('--death-anim-delay'));

class EnemyDOMController {
    game;
    constructor(game) {
        this.game = game;

        enemyImage.onclick = this.game.hitEnemy.bind(game);
        enemyImage.src = `img/${game.enemy.name}.png`;

        this.updateEnemyHealthBar();
        this.updateEnemyName();
    }

    playHitAnim() {
        enemyImage.classList.remove('hit-anim');
        enemyImage.offsetWidth;
        enemyImage.classList.add('hit-anim');
    }

    playDeathAnim() {
        enemyImage.classList.add('death-anim');
        setTimeout(() => {
            enemyImage.classList.remove('death-anim');
        }, deathAnimDelay);
        return deathAnimDelay;
    }

    updateEnemy() {
        this.updateEnemyHealthBar();
        this.updateEnemyName();

        enemyImage.classList.remove('hit-anim');
        enemyImage.classList.remove('death-anim');
    }

    updateEnemyName() {
        enemyName.textContent = this.game.enemy.name;
    }

    updateEnemyHealthBar() {
        enemyHealthBarText.textContent = `${this.game.enemy.health}/${this.game.enemy.maxHealth}`;
        setBarFill(enemyHealthBar, this.game.enemy.health / this.game.enemy.maxHealth * 100);
    }
}

class UnitDOMController {
    constructor(game, element, unit, unitIndex) {
        this.element = element;
        this.unit = unit;
        this.game = game;
        this.unitIndex = unitIndex;

        this.element.onclick = this.buy.bind(this);

        const name = this.element.getElementsByClassName('shop-item-name')[0];
        name.textContent = this.unit.name;

        const attack = this.element.getElementsByClassName('shop-item-attack')[0];
        attack.textContent = this.unit.damage;

        this.updateCount();
        this.updateCost();
    }

    buy() {
        this.game.buyUnit(this.unitIndex);
    }

    updateCost() {
        const price = this.element.getElementsByClassName('shop-item-price')[0];
        price.textContent = Number(this.unit.cost);
    }

    updateCount() {
        const count = this.element.getElementsByClassName('shop-item-count')[0];
        count.textContent = this.unit.count;
    }

    updateAvaliability() {
        if (this.game.money < this.unit.cost) {
            this.element.classList.add('shop-item-disabled');
        }
        else {
            this.element.classList.remove('shop-item-disabled');
        }
    }
}

class InfoDOMController {
    updateMoneyBar(money) {
        moneyBar.textContent = money;
    }
    updateAttackBar(attack) {
        attackBar.textContent = attack;
    }
}