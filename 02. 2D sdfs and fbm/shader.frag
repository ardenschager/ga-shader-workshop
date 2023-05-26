#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;

#define PI 3.14159265

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

// Circle SDF
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Box SDF
float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, vec2(0))) + min(max(d.x, d.y), 0.0);
}

// Regular polygon SDF
float sdPentagon( in vec2 p, in float r )
{
    const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
    p.x = abs(p.x);
    p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
    p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
    p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);    
    return length(p)*sign(p.y);
}

void main() {
    vec2 shapeCoord = 2. * ((vUv) - vec2(0.5)) * uResolution / min(uResolution.x, uResolution.y);

    // float fbmResult0 = fbm(uv + iTime * 0.2);
    // float fbmResult1 = fbm(uv + iTime * 0.3);
    // float fbmResult2 = fbm(uv + vec2(fbmResult0, fbmResult1));
    // Uncomment one of the shapes below
    float dCircle0 = sdCircle(shapeCoord, 0.3);
    // float d = sdBox(shapeCoord, vec2(0.5, 0.1));
    float dPentagon = sdPentagon(shapeCoord, 0.3) - dCircle0 * 0.1;
    shapeCoord += vec2(cos(uTime * 0.45), sin(uTime * 0.5));
    float dCircle1 = sdCircle(shapeCoord + 0.05, 0.2);
    float fbmResult = fbm(shapeCoord + uTime * 0.2);
    float result0 = smoothstep(0.01, 0.012, -dPentagon + 0.1 * fbmResult);
    float result1 = smoothstep(0.01, 0.012, -dCircle1 + 0.1 * fbmResult);
    vec3 color0 = mix(vec3(0.0, 0.0, 1.0), vec3(1.0, 1.0, 1.0), result0);
    vec3 finalColor = mix(color0, vec3(1., 0., 1.), result1);
    gl_FragColor = vec4(finalColor, 1.0);
}