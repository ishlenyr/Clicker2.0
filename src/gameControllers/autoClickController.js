class autoClickController {
    constructor(game) {
        this.game = game;
        this.autoClickEnabled = false;
        this.delay = 200;
        this.clickEnemyBounded = this.clickEnemy.bind(this);
    }
    enableEnemyAutoClick() {
        this.autoClickEnabled = true;
        this.clickEnemy();
    }
    disableEnemyAutoClick() {
        this.autoClickEnabled = false;
    }
    clickEnemy() {
        if (this.game.enemy.health > 0) {
            this.game.enemyController.hitEnemy();
        }
        if (this.autoClickEnabled) {
            setTimeout(this.clickEnemyBounded, this.delay);
        }
    }
}

export default autoClickController;