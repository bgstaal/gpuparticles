let rotAxis = `
vec3 rotAxis(vec3 v, vec3 axis, float angle)
{
	return (1.0 - cos(angle)) * dot(v, axis) * axis + cos(angle) * v + sin(angle) * cross(axis, v);
}`;

let PI = "#define PI 3.1415926538";

let getFaceNormal = `
vec3 getFaceNormal(vec3 position) 
{
	vec3 dx = dFdx(position);
	vec3 dy = dFdy(position);
	return normalize(cross(dy, dx));
}
`;

let triangleIntersect = `
	// Triangle intersection. Returns { t, u, v }
	vec3 triIntersect( in vec3 ro, in vec3 rd, in vec3 v0, in vec3 v1, in vec3 v2 )
	{
	    vec3 v1v0 = v1 - v0;
	    vec3 v2v0 = v2 - v0;
	    vec3 rov0 = ro - v0;

	#if 1
	    // Cramer's rule for solcing p(t) = ro+t·rd = p(u,v) = vo + u·(v1-v0) + v·(v2-v1)
	    float d = 1.0/determinant(mat3(v1v0, v2v0, -rd ));
	    float u =   d*determinant(mat3(rov0, v2v0, -rd ));
	    float v =   d*determinant(mat3(v1v0, rov0, -rd ));
	    float t =   d*determinant(mat3(v1v0, v2v0, rov0));
	#else
	    // The four determinants above have lots of terms in common. Knowing the changing
	    // the order of the columns/rows doesn't change the volume/determinant, and that
	    // the volume is dot(cross(a,b,c)), we can precompute some common terms and reduce
	    // it all to:
	    vec3  n = cross( v1v0, v2v0 );
	    vec3  q = cross( rov0, rd );
	    float d = 1.0/dot( rd, n );
	    float u = d*dot( -q, v2v0 );
	    float v = d*dot(  q, v1v0 );
	    float t = d*dot( -n, rov0 );
	#endif    

	    if( u<0.0 || v<0.0 || (u+v)>1.0 ) t = -1.0;
	    
	    return vec3( t, u, v );
	}
`;


let rgb2hsv = `
	vec3 rgb2hsv(vec3 c)
	{
	    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	    float d = q.x - min(q.w, q.y);
	    float e = 1.0e-10;
	    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
	}
`;

let hsv2rgb = `
	vec3 hsv2rgb(vec3 c)
	{
	    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
	}
`;

let rotationMatrix = `
	mat4 rotationMatrix(vec3 axis, float angle)
	{
	    axis = normalize(axis);
	    float s = sin(angle);
	    float c = cos(angle);
	    float oc = 1.0 - c;
	    
	    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
	                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
	                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
	                0.0,                                0.0,                                0.0,                                1.0);
	}
`;

let map = `
	float map(float value, float min1, float max1, float min2, float max2) {
	  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
	}
`

let uvFromIndex = `
	vec2 uvFromIndex (int i, ivec2 s)
	{
		float y = floor(float(i) / float(s.x));
		float x = float(i) - (y * float(s.x));
		vec2 uv = vec2(x, y) / vec2(s); // add tiny epsilon to squash rounding bug on M1s
		return uv;
	}
`;

let texture2DAtIndex = `
	vec4 texture2DAtIndex (sampler2D tex, int i, ivec2 s)
	{
		vec2 uv = uvFromIndex(i, s);
		return texture2D(tex, uv);
	}
`;

export {rotAxis, PI, getFaceNormal, triangleIntersect, rgb2hsv, hsv2rgb, rotationMatrix, map, uvFromIndex, texture2DAtIndex};