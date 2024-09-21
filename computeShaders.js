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


export {createPosTargetShader};