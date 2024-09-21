import {cnoise3, hash12} from './glslNoise.js';
import {uvFromIndex} from './glslUtils.js';

let t = THREE;
let dummyTex = new t.Texture();

function createPointsMaterial (nX, nY)
{
	let vert = `

		${cnoise3}
		${hash12}
		${uvFromIndex}

		uniform sampler2D posTarget;
		uniform sampler2D acc;
		uniform sampler2D vel;
		uniform sampler2D pos;
		uniform float time;
		varying float alpha;
		varying vec3 col;

		void main() 
		{
			int i = gl_VertexID;
			ivec2 size = ivec2(${nX}, ${nX});
			vec2 uv = uvFromIndex(i, size);
			vec4 posTarget = texture2D(posTarget, uv);
			vec4 pos = texture2D(pos, uv);

			vec3 p = position;
			float t = time * 0.0003;

			float n = hash12(vec2(float(i), 0.0));
			float ps = pow(n, 2.0);
			alpha = .2 + pow(n, 20.0) * .3;
			ps *= 2.0;

			
			if (n > .999)
			{
				ps *= 1.1;
				alpha *= 2.0;
			}


			p = pos.xyz;


			vec4 a = texture2D(vel, uv);
			vec3 c1 = vec3(1.0, 0.0, 0.0);
			vec3 c2 = vec3(1.0, .4, 0.2);
			float s = pow(length(a) / 1.5, 5.0) * 1.5;
			s = clamp(s, 0.0, 1.0);
			col = mix(c1, c2, s);

			gl_PointSize = ps;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
		}
	`;

	let frag = `
		uniform float time;
		varying float alpha;
		varying vec3 col;

		void main() 
		{
			gl_FragColor = vec4(col.rgb, alpha);
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