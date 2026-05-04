import {
  Application,
  Filter,
  GlProgram,
  ColorMatrixFilter,
  BlurFilter,
} from "pixi.js";
import { ConfigHandler } from "./modules/ConfigHandler";
import { Metaball } from "./modules/Metaball";
import { MetaballSet } from "./modules/MetaballSet";

const vertex = `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  uniform vec4 uInputSize;
  uniform vec4 uOutputFrame;
  uniform vec4 uOutputTexture;

  vec4 filterVertexPosition( void )
  {
      vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;

      position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
      position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

      return vec4(position, 0.0, 1.0);
  }

  vec2 filterTextureCoord( void )
  {
      return aPosition * (uOutputFrame.zw * uInputSize.zw);
  }

  void main(void)
  {
      gl_Position = filterVertexPosition();
      vTextureCoord = filterTextureCoord();
  }
`;

const fragment = `
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;

  void main(void)
  {
      vec4 fg = texture2D(uTexture, vTextureCoord);

      if (fg.a > 0.9) {
          fg.a = 1.0;
      }
      else
      {
          if (fg.a < 0.84)
          {
              fg.a = 0.0;
          }
          else
          {
              fg.a = fg.a - (0.9 - fg.a) * (0.9 / (0.9 - 0.84));
          }
      }


      gl_FragColor = fg;
  }
`;

const alphaThresholdFilter = new Filter({
  glProgram: new GlProgram({
    fragment,
    vertex,
  }),
  resources: {},
});

const invertFilter = new ColorMatrixFilter();
invertFilter.negative(true);

// const blurFilter = new BlurFilter({ strength: 1, quality: 4, kernelSize: 5 });

const app = new Application();
await app.init({
  background: "#000000",
  backgroundAlpha: 1,
  resizeTo: window,
  antialias: true,
});
document.body.appendChild(app.canvas);
app.stage.filters = [alphaThresholdFilter, invertFilter];

window.addEventListener("resize", () => app.resize());
export default app;

const configHandler = new ConfigHandler();
const inputElements = configHandler.inputElements;

function generateEmails() {
  if (app.stage.children) app.stage.removeChildren();

  for (let i = 0; i < 128; i++) {
    const metaballSet = new MetaballSet({
      metaballRadius: 128,
      metaballQuantity: 3,
      containerSize: 256,
    });
    app.stage.addChild(metaballSet);
  }
}

generateEmails();

console.log(app.stage.children);

app.ticker.add(() => {
  for (const container of app.stage.children) {
    if (!container.clicked) container.updatePoints();

    for (const ball of container.children) {
      ball.rotation += ball.rotationSpeed;
    }
  }
});
