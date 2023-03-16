import { UnitDOMController } from "../DOMControllers.js";
import unitTypes from "../sets/unitTypes.js";
import { Unit } from "../entities.js";

class shopController {
	constructor(game) {
		this.game = game;
		this.units = [];

		this.bindUnitsToElements();
	}

	updateUnitsAviability() {
		this.units.forEach((x) =>
			x.controller.updateAvaliability(this.game.money)
		);
	}

	bindUnitsToElements() {
		for (let i = 0; i < unitTypes.length; i++) {
			const unit = new Unit(unitTypes[i]);
			const element = document.getElementById(unit.id);
			const DOMController = new UnitDOMController({
				element,
				unit,
				unitIndex: i,
			});
			DOMController.setClickListener(this.buyUnit.bind(this));
			this.units.push({
				entity: unit,
				controller: DOMController,
			});
		}
	}

	buyUnit(index) {
		if (this.units[index].entity.cost <= this.game.money) {
			const buySound = new Audio("./audio/buy.wav").play();
			this.game.money -= this.units[index].entity.cost;
			this.units[index].entity.count++;
			this.game.onMoneyChange();

			this.game.damage += this.units[index].entity.damage;
			this.game.infoDOM.updateAttackBar(this.game.damage);
			this.units[index].controller.updateCost();
			this.units[index].controller.updateCount();
		}
	}
}

export default shopController;
