import { Graphics, Sprite } from "pixi.js";

import app from "../index.js";

// the base Metaball class
// It defines requires a radius,
// the size of the container in which it is situated,
// and a fill style

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
    this._addEventListeners();
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
    this.sprite.radius = this.metaballRadius;
    this.sprite.skewSpeed = Math.random() * Math.PI;
    this.sprite.skewPhaseX = Math.random();
    this.sprite.skewPhaseY = Math.random();
    this.sprite.rotationSpeed = Math.cos(Math.random() * Math.PI * 2) / 128;
    this.sprite.vx = 1;
    this.sprite.vy = 1;
  }

  _addEventListeners() {
    // this defines the logic for movement when the blob is clicked and dragged
    this.sprite.eventMode = "static";

    this.sprite.onmousedown = () => {
      this.sprite.onglobalmousemove = (event) => {
        this.sprite.clicked = true;

        const localPoint = this.sprite.parent.toLocal({
          x: event.globalX,
          y: event.globalY,
        });
        this.sprite.position.set(localPoint.x, localPoint.y);
      };
    };

    this.sprite.onmouseup = () => {
      this.sprite.clicked = false;
      this.sprite.onglobalmousemove = undefined;
    };
    this.sprite.onmouseupoutside = () => {
      this.sprite.clicked = false;
      this.sprite.onglobalmousemove = undefined;
    };
  }
}
