import { Graphics, Sprite } from "pixi.js";
import "pixi.js/advanced-blend-modes";
import app from "../index.js";

export class Metaball extends Graphics {
  constructor({ metaballRadius, containerSize, metaballFill }) {
    super();

    this.metaballRadius = metaballRadius;
    this.containerSize = containerSize;
    this.metaballFill = metaballFill;

    this._getCenter();
    this._generateBall();
    this._toSprite();
    this._addSpriteVariables();
  }

  _getCenter() {
    this.center = {
      x:
        Math.random() * (this.containerSize - this.metaballRadius) +
        this.metaballRadius,
      y:
        Math.random() * (this.containerSize - this.metaballRadius) +
        this.metaballRadius,
    };
  }
  _generateBall() {
    this.arc(0, 0, this.metaballRadius, 0, Math.PI * 2).fill(this.metaballFill);
  }

  _toSprite() {
    const texture = app.renderer.generateTexture(this);
    this.sprite = Sprite.from(texture);
    this.sprite.position = this.center;
    this.destroy();
  }

  _addSpriteVariables() {
    this.sprite.anchor = 0.5;
    this.sprite.skewSpeed = Math.random() * Math.PI;
    this.sprite.skewPhaseX = Math.random();
    this.sprite.skewPhaseY = Math.random();
    this.sprite.rotationSpeed = Math.cos(Math.random() * Math.PI * 2) / 128;
    this.sprite.vx = 1;
    this.sprite.vy = 1;
  }
}
