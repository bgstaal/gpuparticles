import {hash12, cnoise4} from './glslNoise.js';
import {PI} from './glslUtils.js';

function createPosTargetShader ()
{
	return `
		${PI}
		${hash12}

		uniform float time;

		void main ()
		{
			float nPoints = resolution.x * resolution.y;
			float i = (gl_FragCoord.y * resolution.x) + gl_FragCoord.x;
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			vec3 pos = vec3(0.0);
			float angle = (i / nPoints) * PI * 2.0;
			float rad = sin(time * 0.0001) * 200.0;
			rad = 80.0 + hash12(vec2(i * 0.123, i * 3.453)) * 80.0;
			pos.x = cos(angle) * rad;
			pos.y = sin(angle) * rad;
			pos.z = 0.0;

			gl_FragColor = vec4(pos, 1.0);
		}
	`;
}

function createAccShader ()
{
	return `
		${PI}
		${cnoise4}
		${hash12}

		uniform float time;

		void main ()
		{
			float nPoints = resolution.x * resolution.y;
			float i = (gl_FragCoord.y * resolution.x) + gl_FragCoord.x;
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			vec3 a = vec3(0.0);
			vec4 p = texture2D(pos, uv);
			vec4 tar = texture2D(posTarget, uv);

			vec3 turb;
			float t = time * 0.0001;
			float n = hash12(uv * 0.02 + i);
			float s = .2;

			turb.x = cnoise(vec4(p.xyz * 0.006 + n * 35.4, t));
			turb.y = cnoise(vec4(p.xyz * 0.007 + n * 32.3, t));
			turb.z = cnoise(vec4(p.xyz * 0.006 + n * 43.3, t));
			turb *= pow(cnoise(vec4(p.xyz * 0.01, time * 0.0003)), 3.0) * s * 20.0;
			a += turb;


			vec3 back = tar.xyz - p.xyz;
			//back *= 0.001;
			back *= ((1.0 + pow(cnoise(vec4(tar.xyz * 0.002, time * 0.0001) ), 1.0)) / 2.0) * 0.003;
			a += back;

			

			vec3 collect;
			collect = p.xyz * -.0003;

			//a +=  collect;

			gl_FragColor = vec4(a, 1.0);
		}
	`;
}

function createVelShader ()
{
	return `

		${PI}

		uniform float time;

		void main ()
		{
			float nPoints = resolution.x * resolution.y;
			float i = (gl_FragCoord.y * resolution.x) + gl_FragCoord.x;
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			vec4 a = texture2D(acc, uv);
			vec4 v = texture2D(vel, uv);
			v += a;
			v *= .97; 

			gl_FragColor = vec4(v.xyz, 1.0);
		}
	`;
}

function createPosShader ()
{
	return `

		${PI}

		uniform float time;
		uniform int frame;

		void main ()
		{
			float nPoints = resolution.x * resolution.y;
			float i = (gl_FragCoord.y * resolution.x) + gl_FragCoord.x;
			vec2 uv = gl_FragCoord.xy / resolution.xy;

			vec4 p;

			if (frame < 2)
			{
				p = texture2D(posTarget, uv);
			}
			else
			{
				p = texture2D(pos, uv);
				p += texture2D(vel, uv);
			}
			
			gl_FragColor = vec4(p.xyz, 1.0);
		}
	`;
}


export {createPosTargetShader, createAccShader, createVelShader, createPosShader};