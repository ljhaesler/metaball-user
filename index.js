import { Application } from "pixi.js";
import { ConfigHandler } from "./modules/ConfigHandler";
import { MetaballSetSpawner } from "./modules/MetaballSetSpawner";
import { filters } from "./modules/Filters";

const app = new Application();
await app.init({
  background: "#000000",
  backgroundAlpha: 1,
  resizeTo: window,
  antialias: true,
});
document.body.appendChild(app.canvas);
app.stage.filters = filters;

window.addEventListener("resize", () => app.resize());
export default app;

const configHandler = new ConfigHandler();
const inputElements = configHandler.inputElements;

function generateMetaballs() {
  if (app.stage.children) app.stage.removeChildren();

  const metaballSetSpawner = new MetaballSetSpawner({
    metaballRadius: 128,
    metaballQuantity: 4,
    containerSize: 512,
    fillColors: [0xff8800, 0xffee00, 0xff3300, 0xff0000],
  });

  const metaballSets = metaballSetSpawner.spawnSets(4);
  app.stage.addChild(...metaballSets);
}

generateMetaballs();

console.log(app.stage.children);
let t = 0;
app.ticker.add(() => {
  t += 0.01;
  for (const container of app.stage.children) {
    if (!container.clicked) container.rotation += container.rotationSpeed;
    container.updatePoints();
    for (const ball of container.children) {
      ball.skew.set(
        Math.cos(t * ball.skewSpeed + ball.skewPhaseX) / 8,
        Math.cos(t * ball.skewSpeed + ball.skewPhaseY) / 8,
      );
      ball.rotation += ball.rotationSpeed;
    }
  }
});
