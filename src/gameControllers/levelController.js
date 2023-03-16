import enemyTypes from "../sets/enemyTypes.js";
import levels from "../sets/levels.js";

class levelController {
    constructor(game) {
        this.game = game;
    }
    changeLevel(level) {
        this.game.currentLevel = level;
        this.game.enemyHealthMultiplier = levels[level - 1].healthMultiplier;

        this.game.enemiesKilled = 0;
        this.game.enemiesOnLevel = 0;

        // update level bar
        this.game.levelBar.setText(`Level ${level}`);
        this.game.levelBar.setProgress(0);

        // fill enemy pool with new enemies
        levels[level - 1].enemies.forEach((e) => {
            const enemyTypeIndex = enemyTypes.findIndex((x) => x.id === e.id);
            for (let index = 0; index < e.count; index++) {
                this.game.enemyIndexPool.push(enemyTypeIndex);
                this.game.enemiesOnLevel++;
            }
        });

        this.game.enemyController.changeEnemyToNext(); // update once we're done
    }
}

export default levelController;