import { MetaballFills } from "./MetaballFills";
import { MetaballSet } from "./MetaballSet";

export class MetaballSetSpawner {
  constructor({ metaballRadius, metaballQuantity, containerSize, fillColors }) {
    this.fillColors = fillColors;
    this.containerSize = containerSize;
    this.metaballQuantity = metaballQuantity;
    this.metaballRadius = metaballRadius;

    this._getFills();
  }

  spawnSets(quantity) {
    const metaballSets = [];

    for (let i = 0; i < quantity; i++) {
      metaballSets.push(
        new MetaballSet({
          metaballRadius: this.metaballRadius,
          containerSize: this.containerSize,
          metaballQuantity: this.metaballQuantity,
          metaballFills: this.metaballFills,
        }),
      );
    }

    return metaballSets;
  }

  _getFills() {
    this.metaballFills = new MetaballFills(this.fillColors);
  }
}
