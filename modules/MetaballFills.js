import { FillGradient } from "pixi.js";

export class MetaballFills {
  constructor() {
    this._generateFills();
  }

  returnUniqueFills(quantity) {
    const pool = this.fillGradients.slice();
    const uniqueFills = [];

    for (let i = 0; i < quantity; i++) {
      const index = Math.floor(Math.random() * pool.length);
      const fill = pool[index];
      uniqueFills.push(fill);
      pool.splice(index, 1);
    }

    return uniqueFills;
  }

  _generateFills() {
    this.fillGradients = [
      new FillGradient({
        type: "radial",
        center: { x: 0.5, y: 0.5 },
        innerRadius: 0,
        outerCenter: { x: 0.5, y: 0.5 },
        outerRadius: 0.5,
        colorStops: [
          { offset: 0.35, color: "#00ffffff" }, // Center color
          { offset: 1, color: "#00ffff00" }, // Edge color
        ],
      }),
      new FillGradient({
        type: "radial",
        center: { x: 0.5, y: 0.5 },
        innerRadius: 0,
        outerCenter: { x: 0.5, y: 0.5 },
        outerRadius: 0.5,
        colorStops: [
          { offset: 0.35, color: "#ffff00ff" }, // Center color
          { offset: 1, color: "#ffff0000" }, // Edge color
        ],
      }),
      new FillGradient({
        type: "radial",
        center: { x: 0.5, y: 0.5 },
        innerRadius: 0,
        outerCenter: { x: 0.5, y: 0.5 },
        outerRadius: 0.5,
        colorStops: [
          { offset: 0.35, color: "#ff00ffff" }, // Center color
          { offset: 1, color: "#ff00ff00" }, // Edge color
        ],
      }),
    ];
  }
}
