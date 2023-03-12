export { Unit, Enemy };

class Unit {
  get cost() {
    return Math.round(this.baseCost * 1.15 ** this.count);
  }

  constructor(type) {
    this.id = type.id;
    this.baseCost = type.baseCost;
    this.count = 0;
    this.damage = type.baseDamage;
    this.name = type.name;
  }
}

class Enemy {
  constructor() {
    this.maxHealth = 0;
    this.health = 0;
    this.name = '';
  }

  hit(damage) {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  change(enemyType, healthMultiplier) {
    this.maxHealth = enemyType.baseHealth * healthMultiplier;
    this.health = this.maxHealth;
    this.name = enemyType.name;
  }
}
