import { Container } from "pixi.js";
import { Metaball } from "./Metaball";
import "pixi.js/advanced-blend-modes";
import app from "../index";

export class MetaballSet extends Container {
  constructor({
    metaballRadius,
    metaballQuantity,
    containerSize,
    metaballFills,
  }) {
    super({
      height: containerSize,
      width: containerSize,
      pivot: containerSize / 2,
    });


    this.containerSize = containerSize;
    this.metaballQuantity = metaballQuantity;
    this.metaballRadius = metaballRadius;
    // we immediately get the unique fills for the metaballs that will be present inside the set
    this.metaballFills = metaballFills.returnUniqueFills(this.metaballQuantity);
    this.metaballs = [];

    this._getPosition();
    this._generateMetaballs();
    this._addMetaballsAsChildren();
    this._addContainerVariables();
    this._addEventListeners();
	}

  updateChildren() {
    const friction = 0.9;
    const repulsionStrength = 0.02; // Adjust this to control how hard they push away
    const minDistance = this.metaballRadius; // The distance at which repulsion starts (sum of radii + buffer)

    // 1. First pass: Calculate repulsion forces between all pairs
    for (let i = 0; i < this.children.length; i++) {
      const ballA = this.children[i];

      // Skip if clicked (optional, depending on if you want clicked balls to still repel)
      if (ballA.clicked) continue;

      for (let j = i + 1; j < this.children.length; j++) {
        const ballB = this.children[j];

        if (ballB.clicked) continue;

        const dx = ballB.x - ballA.x;
        const dy = ballB.y - ballA.y;
        const distanceSq = dx * dx + dy * dy;

        // Only apply repulsion if they are too close
        if (distanceSq < minDistance * minDistance && distanceSq > 0) {
          const distance = Math.sqrt(distanceSq);

          // Calculate the normalized direction vector
          const nx = dx / distance;
          const ny = dy / distance;

          // Calculate force magnitude (stronger when closer)
          // We use (minDistance - distance) to get a stronger push as they overlap more
          const force = (minDistance - distance) * repulsionStrength;

          // Apply equal and opposite forces to both balls
          ballA.vx -= nx * force;
          ballA.vy -= ny * force;

          ballB.vx += nx * force;
          ballB.vy += ny * force;
        }
      }
    }

    // 2. Second pass: Apply movement, friction, and container attraction
    for (const ball of this.children) {
      if (ball.clicked) continue;

      // Container center attraction (your original logic)
      const dxCenter = this.containerSize / 2 - ball.x;
      const dyCenter = this.containerSize / 2 - ball.y;

      // Add a small amount of center attraction to velocity
      ball.vx += dxCenter * 0.04;

      ball.vy += dyCenter * 0.04;

      // Apply friction
      ball.vx *= friction;
      ball.vy *= friction;

      // Update position
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Optional: Boundary checks to keep them inside the container
      if (ball.x < 0) {
        ball.vx *= -1;
      }
      if (ball.x > this.containerSize) {
        ball.vx *= -1;
      }
      if (ball.y < 0) {
        ball.vy *= -1;
      }
      if (ball.y > this.containerSize) {
        ball.vy *= -1;
      }
    }
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
          // a metaball requires a single fillstyle
          metaballFill: this.metaballFills[i],
        }),
      );
    }
  }

  _addMetaballsAsChildren() {
    for (const metaball of this.metaballs) {
      // these metaballs are by default graphics objects, so we have to return the sprite value
      this.addChild(metaball.sprite);
    }
  }

  _addEventListeners() {
    // the container checks for click events
    // this info is then used to stop orbiting when a blob inside the container is clicked
    this.eventMode = "static";
    this.onmousedown = () => (this.clicked = true);
    this.onmouseup = () => (this.clicked = false);
    this.onmouseupoutside = () => (this.clicked = false);
  }

  _addContainerVariables() {
    this.rotationSpeed = Math.cos(Math.random() * Math.PI * 2) / 256;
  }
}
