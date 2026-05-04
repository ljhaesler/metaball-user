import { Graphics, FillGradient, ColorMatrixFilter, Sprite } from "pixi.js";
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
    this.sprite.skew.set(Math.random() / 16, Math.random() / 16);
    this.sprite.rotationSpeed = Math.cos(Math.random() * Math.PI * 2) / 64;
    this.sprite.vx = Math.random();
    this.sprite.vy = Math.random();
  }
}
