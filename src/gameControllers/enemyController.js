import enemyTypes from "../sets/enemyTypes.js";

class enemyController {
	constructor(game) {
		this.game = game;
	}
	changeEnemyToNext() {
		if (this.game.enemyIndexPool.length === 0) {
			this.game.levelController.changeLevel(++this.game.currentLevel);
		}
		this.game.enemy.change(
			enemyTypes[this.game.enemyIndexPool.pop()],
			this.game.enemyHealthMultiplier
		);
		this.game.enemyDOM.update(this.game.enemy);
	}

	hitEnemy() {
		const hitSound = new Audio("./audio/kick.wav").play();
		const remainingHelath = this.game.enemy.health;
		this.game.enemy.hit(this.game.damage);
		this.game.stats.totalEnemyClicks++;
		this.game.enemyDOM.updateEnemyHealthBar(this.game.enemy);

		if (this.game.enemy.health <= 0) {
			const deathSound = new Audio("./audio/death.wav").play();
			const delay = this.game.enemyDOM.playDeathAnim();
			this.game.money += this.game.enemy.maxHealth + remainingHelath;
			this.game.onMoneyChange();

			setTimeout(() => {
				this.game.enemiesKilled++;
				this.game.levelBar.setProgress(
					(this.game.enemiesKilled / this.game.enemiesOnLevel) * 100.0
				);
				if (this.game.currentLevel === 10) {
					this.game.enemyDOM.hide();
					alert("You won!");
					return;
				}
				this.changeEnemyToNext();
			}, delay);
		} else {
			this.game.money += this.game.damage;
			this.game.onMoneyChange();
			this.game.enemyDOM.playHitAnim();
		}
	}
}

export default enemyController;
