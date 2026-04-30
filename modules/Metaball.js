import { Graphics, FillGradient, ColorMatrixFilter } from "pixi.js";
import "pixi.js/advanced-blend-modes";
import app from "../index.js";

export class Metaball extends Graphics {
  constructor(vertexQuantity, metaballRadius) {
    super();

    this.metaballRadius = metaballRadius * Math.floor(Math.random() * 2 + 1);
    this.vertexQuantity = vertexQuantity;

    this._getCenter();
    this._getVertexPoints();
    this._generateFills();
    this._generateBall();
    this._addEventListeners();

    const invertFilter = new ColorMatrixFilter();
    invertFilter.negative(true);
    this.filters = [invertFilter];
    // this.blendMode = "add";
  }

  _getCenter() {
    this.center = {
      x:
        Math.random() * (app.screen.width - this.metaballRadius * 2) +
        this.metaballRadius,
      y:
        Math.random() * (app.screen.height - this.metaballRadius * 2) +
        this.metaballRadius,
    };
  }

  _generateBall() {
    this.poly(this.vertices).fill(
      this.fillGradients[Math.floor(Math.random() * 2)],
    );
  }

  _getVertexPoints() {
    this.vertices = [];

    for (let i = 0; i < this.vertexQuantity; i++) {
      let xValue =
        this.center.x +
        Math.cos((i / this.vertexQuantity) * (Math.PI * 2)) *
          this.metaballRadius;
      let yValue =
        this.center.y +
        Math.sin((i / this.vertexQuantity) * (Math.PI * 2)) *
          this.metaballRadius;
      this.vertices.push(Math.floor(xValue), Math.floor(yValue));
    }
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
          { offset: 0.25, color: "#eeee00ff" }, // Center color
          { offset: 1, color: "#eeee0000" }, // Edge color
        ],
      }),
      new FillGradient({
        type: "radial",
        center: { x: 0.5, y: 0.5 },
        innerRadius: 0,
        outerCenter: { x: 0.5, y: 0.5 },
        outerRadius: 0.5,
        colorStops: [
          { offset: 0.25, color: "#ff0000ff" }, // Center color
          { offset: 1, color: "#ff000000" }, // Edge color
        ],
      }),
    ];
  }

  _addEventListeners() {
    this.eventMode = "dynamic";

    this.onmousedown = () => {
      this.onglobalmousemove = (event) => {
        const relativePoint = {
          x: event.globalX - this.center.x,
          y: event.globalY - this.center.y,
        };
        this.position.set(relativePoint.x, relativePoint.y);
      };
    };

    this.onmouseup = () => {
      this.onglobalmousemove = undefined;
    };
    this.onmouseupoutside = () => {
      this.onglobalmousemove = undefined;
    };
  }
}
