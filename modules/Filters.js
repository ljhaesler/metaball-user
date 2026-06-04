import { Filter, GlProgram, ColorMatrixFilter } from "pixi.js";

const maxOutValue = 0.9;
const floorValue = 0.8;
const gradientSpace = maxOutValue - floorValue;

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

      if (fg.a >= ${maxOutValue}) {
        fg.a = 1.0;
      } else if (fg.a <= ${floorValue}) {
      	fg.a = 0.0;
      } else {
      	fg.a = (fg.a - ${floorValue}) / ${gradientSpace};
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
invertFilter.negative();


export const filters = [alphaThresholdFilter, invertFilter];
