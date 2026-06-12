import { FillGradient, Color } from "pixi.js";

export class MetaballFills {
	constructor(colorSets) {
		this.colorSets = colorSets;
		this.fillGradients = [];

		this._invertColors();
		this._generateFills();
	}

	returnUniqueFills(quantity) {
		const gradientsCopy = this.fillGradients.slice();
		const pool =
			gradientsCopy[Math.floor(Math.random() * gradientsCopy.length)].slice();
		const uniqueFills = [];

		for (let i = 0; i < quantity; i++) {
			const index = Math.floor(Math.random() * pool.length);
			const fill = pool[index];
			uniqueFills.push(fill);
			pool.splice(index, 1);
		}

		return uniqueFills;
	}

	_invertColors() {
		console.log(this.colorSets);
		this.colorSets = this.colorSets.map((colorSet) =>
			colorSet.map((color) => {
				const numericValue = parseInt(color, 16);
				const invertedValue = numericValue ^ 0xffffff;
				return new Color(invertedValue).toHex();
			}),
		);
	}

	_generateFills() {
		for (let i = 0; i < this.colorSets.length; i++) {
			this.fillGradients.push([]);
			for (let j = 0; j < this.colorSets[i].length; j++) {
				this.fillGradients[i].push(
					new FillGradient({
						type: "radial",
						center: { x: 0.5, y: 0.5 },
						innerRadius: 0,
						outerCenter: { x: 0.5, y: 0.5 },
						outerRadius: 0.5,
						colorStops: [
							{ offset: 0.4, color: this.colorSets[i][j] }, // Center color
							{ offset: 1, color: `${this.colorSets[i][j]}00` }, // Edge color
						],
					}),
				);
			}
		}
	}
}
