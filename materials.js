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
		uniform float time;
		varying float alpha;
		varying vec3 col;

		void main() 
		{
			int i = gl_VertexID;
			ivec2 size = ivec2(${nX}, ${nX});
			vec2 uv = uvFromIndex(i, size);
			vec4 posTarget = texture2D(posTarget, uv);

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

			p = posTarget.xyz;

			gl_PointSize = ps;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
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
			posTarget: {value: dummyTex}
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