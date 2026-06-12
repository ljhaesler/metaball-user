import { Application } from "pixi.js";
import { ConfigHandler } from "./modules/ConfigHandler";
import { MetaballSet } from "./modules/MetaballSet";
import { filters } from "./modules/Filters";
import { MetaballFills } from "./modules/MetaballFills";

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

inputElements.metaballRadius.onchange = generateMetaballs;
inputElements.metaballQuantity.onchange = generateMetaballs;
inputElements.containerSize.onchange = generateMetaballs;
inputElements.metaballColours.onchange = generateMetaballs;
inputElements.setQuantity.onchange = generateMetaballs;
configHandler.setImportApplyFunction(generateMetaballs);

function generateMetaballs() {
	// if the metaballs are re-generated, remove the previous ones
	if (app.stage.children) app.stage.removeChildren();

	const metaballRadius = inputElements.metaballRadius.get();
	const metaballQuantity = inputElements.metaballQuantity.get();
	const containerSize = inputElements.containerSize.get();
	const metaballColours = inputElements.metaballColours
		.get()
		.split("/")
		.map((el) => el.trim())
		.map((el1) => el1.split(",").map((el2) => el2.trim()));
	const setQuantity = inputElements.setQuantity.get();

	// we need to generate a single fills instance for the metaballs
	const metaballFills = new MetaballFills(metaballColours);

	const metaballSets = [];
	for (let i = 0; i < setQuantity; i++) {
		const metaballSet = new MetaballSet({
			metaballRadius,
			metaballQuantity,
			containerSize,
			metaballFills,
		});

		metaballSets.push(metaballSet);
	}

	// a smaller containerSize will lead to a less 'snappy' effect
	// when the blobs are dragged via the mouse.
	app.stage.addChild(...metaballSets);
}

generateMetaballs();

let t = 0;

app.ticker.add(() => {
	t += inputElements.wobbleIntensity.get() || 0.01;
	const orbitalSpeed = inputElements.orbitalSpeed.get() || 0.5;

	for (const metaballSet of app.stage.children) {
		// if the metaballSet is clicked, we stop the set from orbiting
		if (!metaballSet.clicked) {
			const dcX = metaballSet.x - app.screen.width / 2;
			const dcY = metaballSet.y - app.screen.height / 2;

			const dc = Math.sqrt(dcX * dcX + dcY * dcY);

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
