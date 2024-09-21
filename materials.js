import {cnoise3, hash12} from './glslNoise.js';
import {uvFromIndex, PI} from './glslUtils.js';

let t = THREE;
let dummyTex = new t.Texture();

function createPointsMaterial (nX, nY)
{
	let vert = `

		${cnoise3}
		${hash12}
		${uvFromIndex}
		${PI}

		uniform float time;
		varying float alpha;
		varying vec3 col;

		void main() 
		{
			int i = gl_VertexID;
			ivec2 size = ivec2(${nX}, ${nX});
			int nPoints = size.x * size.y;
			vec2 uv = uvFromIndex(i, size);

			vec3 pos = vec3(0.0);
			float angle = (float(i) / float(nPoints)) * PI * 2.0;
			float rad = sin(time * 0.0001) * 200.0;
			rad = 80.0 + hash12(vec2(float(i) * 0.123, float(i) * 3.453)) * 80.0;
			pos.x = cos(angle) * rad;
			pos.y = sin(angle) * rad;
			pos.z = 0.0;

			float n = hash12(vec2(float(i), 0.0));
			float ps = pow(n, 2.0);
			alpha = .2 + pow(n, 20.0) * .3;
			ps *= 2.0;

			if (n > .999)
			{
				ps *= 1.1;
				alpha *= 2.0;
			}

			gl_PointSize = ps;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
		}
	`;

	let frag = `
		uniform float time;
		varying float alpha;

		void main() 
		{
			gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
		}
	`;

	const material = new THREE.ShaderMaterial(
	{
		uniforms: 
		{
			time: { value: 1.0 },
			/*posTargetTex: {value: dummyTex}*/
		},

		vertexShader: vert,
		fragmentShader: frag,
	  	transparent: true,
	  	depthWrite: false,
	  	depthTest: false,
	  	blending: THREE.AdditiveBlending
	});


	return material;
}

export {createPointsMaterial};