import { Container } from "pixi.js";
import { Metaball } from "./Metaball";
import { MetaballFills } from "./MetaballFills";
import app from "../index";

export class MetaballSet extends Container {
  constructor({ metaballRadius, metaballQuantity, containerSize }) {
    super({
      height: containerSize,
      width: containerSize,
      pivot: containerSize / 2,
    });

    this.containerSize = containerSize;

    this.metaballQuantity = metaballQuantity;
    this.metaballRadius = metaballRadius;
    this.metaballs = [];

    this._getPosition();
    this._getFills();
    this._generateMetaballs();
    this._addMetaballsAsChildren();
    this._addContainerVariables();
    this._addEventListeners();
  }

  updatePoints() {
    const minDistance = 10;
    const repulsionStrength = 2;
    const attractionStrength = 1;
    const friction = 0.008;

    for (const ball of this.children) {
      if (ball.clicked) continue;
      const dx = this.containerSize / 2 - ball.x;
      const dy = this.containerSize / 2 - ball.y;

      ball.vx += dx * attractionStrength;
      ball.vy += dy * attractionStrength;

      for (let i = 0; i < this.children.length; i++) {
        const otherBall = this.children[i];
        if (otherBall === ball) continue;

        const dx2 = ball.x - otherBall.x;
        const dy2 = ball.y - otherBall.y;
        const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist > 0) {
          const force = (minDistance - dist) / minDistance;
          const repulsionX = (dx2 / dist) * force * repulsionStrength;
          const repulsionY = (dy2 / dist) * force * repulsionStrength;
          ball.vx += repulsionX;
          ball.vy += repulsionY;
        }
      }

      ball.vx *= friction;
      ball.vy *= friction;
      ball.x += ball.vx;
      ball.y += ball.vy;
    }
  }

  _getFills() {
    const metaballFills = new MetaballFills();
    this.metaballFills = metaballFills.returnUniqueFills(this.metaballQuantity);
  }

  _getPosition() {
    this.position = {
      x:
        Math.random() * (app.screen.width - this.containerSize) +
        this.containerSize / 2,
      y:
        Math.random() * (app.screen.height - this.containerSize) +
        this.containerSize / 2,
    };
  }

  _generateMetaballs() {
    for (let i = 0; i < this.metaballQuantity; i++) {
      // the order here is important: the smaller balls must be generated after the larger ones.
      this.metaballs.push(
        new Metaball({
          metaballRadius: this.metaballRadius / (i + 1),
          containerSize: this.containerSize,
          metaballFill: this.metaballFills[i],
        }),
      );
    }
  }

  _addMetaballsAsChildren() {
    for (const metaball of this.metaballs) {
      this.addChild(metaball.sprite);
    }
  }

  _addEventListeners() {
    for (const ball of this.children) {
      ball.eventMode = "dynamic";

      ball.onmousedown = () =>
        (ball.onglobalmousemove = (event) => {
          ball.clicked = true;
          const localPoint = this.toLocal({
            x: event.globalX,
            y: event.globalY,
          });
          ball.position.set(localPoint.x, localPoint.y);
        });

      ball.onmouseup = () => {
        ball.clicked = false;
        ball.onglobalmousemove = undefined;
      };
      ball.onmouseupoutside = () => {
        ball.clicked = false;
        ball.onglobalmousemove = undefined;
      };
    }
  }

  _addContainerVariables() {
    this.rotationSpeed = Math.cos(Math.random() * Math.PI * 2) / 128;
  }
}
