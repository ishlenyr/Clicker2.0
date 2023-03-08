export { enemyTypes, unitTypes, Unit, Enemy };

const enemyTypes = [
  {
    baseHealth: 100,
    name: "Amogus",
  },
];

const unitTypes = [
  {
    id: "miniCrewmate",
    baseCost: 5,
    name: "Mini Crewmate",
    baseDamage: 1,
  },
  {
    id: "dog",
    baseCost: 30,
    name: "Dog",
    baseDamage: 5,
  },
  {
    id: "crewmate",
    baseCost: 100,
    name: "Crewmate",
    baseDamage: 10,
  },
  {
    id: "creamateKnife",
    baseCost: 200,
    name: "Crewmate with a knife",
    baseDamage: 20,
  },
  {
    id: "creamatePistol",
    baseCost: 300,
    name: "Crewmate with a pistol",
    baseDamage: 30,
  },
  {
    id: "creamateAlien",
    baseCost: 400,
    name: "Alien Crewmate",
    baseDamage: 40,
  },
  {
    id: "creamateCyborg",
    baseCost: 500,
    name: "Cyborg Crewmate",
    baseDamage: 50,
  },
];

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
  constructor(enemyType) {
    this.health = enemyType.baseHealth;
    this.maxHealth = enemyType.baseHealth;
    this.name = enemyType.name;
  }

  hit(damage) {
    this.health -= damage;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  change(enemyType) {
    this.health = enemyType.baseHealth;
    this.name = enemyType.name;
  }
}
