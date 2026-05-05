import { Application } from "pixi.js";
import { ConfigHandler } from "./modules/ConfigHandler";
import { MetaballSetSpawner } from "./modules/MetaballSetSpawner";
import { filters } from "./modules/Filters";

const app = new Application();
await app.init({
  background: "#000000",
  backgroundAlpha: 1,
  resizeTo: window,
  useBackBuffer: true,
});
document.body.appendChild(app.canvas);
app.stage.filters = filters;

window.addEventListener("resize", () => app.resize());
export default app;

const configHandler = new ConfigHandler();

// unused for now
const inputElements = configHandler.inputElements;

function generateMetaballs() {
  // if the metaballs are re-generated, remove the previous ones
  if (app.stage.children) app.stage.removeChildren();

  // a smaller containerSize will lead to a less 'snappy' effect
  // when the blobs are dragged via the mouse.
  const metaballSetSpawner = new MetaballSetSpawner({
    metaballRadius: 64,
    metaballQuantity: 2,
    containerSize: 128,
    fillColors: [0xffffff, 0xffaaff, 0xff33ff, 0xff00ff],
  });

  const metaballSets = metaballSetSpawner.spawnSets(64);
  app.stage.addChild(...metaballSets);
}

generateMetaballs();

let t = 0;
app.ticker.add(() => {
  t += 0.01;
  for (const metaballSet of app.stage.children) {
    // if the metaballSet is clicked, we stop the set from orbiting
    if (!metaballSet.clicked) {
      const dcX = metaballSet.x - app.screen.width / 2;
      const dcY = metaballSet.y - app.screen.height / 2;

      const dc = Math.sqrt(dcX * dcX + dcY * dcY);

      const orbitalSpeed = 0.5;

      const vx = (-dcY / dc) * orbitalSpeed;
      const vy = (dcX / dc) * orbitalSpeed;
      metaballSet.x += vx;
      metaballSet.y += vy;
      metaballSet.rotation += metaballSet.rotationSpeed;
    }

    metaballSet.updateChildren();

    for (const ball of metaballSet.children) {
      ball.skew.set(
        Math.cos(t * ball.skewSpeed + ball.skewPhaseX) / 8,
        Math.sin(t * ball.skewSpeed + ball.skewPhaseY) / 8,
      );
    }
  }
});
