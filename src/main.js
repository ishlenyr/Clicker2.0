import { EnemyDOMController, UnitDOMController } from './DOMControllers.js';
import { enemyTypes, unitTypes, Unit, Enemy } from './entities.js';
'use strict';
// @ts-check


// Serves as main context for all objects and contains game logic
class Game {
    constructor() {
        this.damage = 10;
        this.units = [];
        this.enemy = new Enemy(enemyTypes[0]);
        this.enemyDOM = new EnemyDOMController(this);

        for (let i = 0; i < unitTypes.length; i++) {
            const unit = new Unit(unitTypes[i]);
            const element = document.getElementById(unit.id);
            this.units.push(
                {
                    entity: unit,
                    controller: new UnitDOMController(this, element, unit, i)
                });
        }
    }

    hitEnemy() {
        this.enemy.hit(this.damage);
        this.enemyDOM.updateEnemyHealthBar();

        if (this.enemy.health <= 0) {
            const delay = this.enemyDOM.playDeathAnim();
            setTimeout(() => {
                this.enemy.change(enemyTypes[0]);
                this.enemyDOM.updateEnemy();
            }, delay);
        }
        else {
            this.enemyDOM.playHitAnim();
        }
    }

    buyUnit(index) {
        this.units[index].entity.count++;
        this.damage += this.units[index].entity.damage;
        this.units[index].controller.updateCost();
        this.units[index].controller.updateCount();
    }
}

const myGame = new Game();