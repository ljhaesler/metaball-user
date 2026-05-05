import { FillGradient, Color } from "pixi.js";

export class MetaballFills {
  constructor(colors) {
    this.colors = colors;

    this._invertColors();
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

  _invertColors() {
    this.colors = this.colors.map((color) =>
      new Color(color ^ 0xffffff).toHex(),
    );
  }

  _generateFills() {
    this.fillGradients = [];
    for (const color of this.colors) {
      this.fillGradients.push(
        new FillGradient({
          type: "radial",
          center: { x: 0.5, y: 0.5 },
          innerRadius: 0,
          outerCenter: { x: 0.5, y: 0.5 },
          outerRadius: 0.5,
          colorStops: [
            { offset: 0.4, color }, // Center color
            { offset: 1, color: `${color}00` }, // Edge color
          ],
        }),
      );
    }
  }
}
