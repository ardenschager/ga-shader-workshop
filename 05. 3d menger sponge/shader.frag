#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

const int MARCHING_ITERATIONS = 64;
const float MARCHING_STEP = 0.5;
const float SMALLEST_STEP = 0.1;
const float DISTANCE = 3.0;
const float MAX_MANDELBROT_DIST = 1.5;
const int MANDELBROT_STEPS = 64;

vec3 cosineColor(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

vec3 palette(float t) {
    return cosineColor(t, vec3(0.5), vec3(0.5), vec3(0.01), vec3(0.0, 0.15, 0.20));
}

vec2 DE(vec3 pos) {
    float Power = 3.0 + 4.0 * (sin(uTime / 30.0) + 1.0);
    vec3 z = pos;
    float dr = 1.0;
    float r = 0.0;
    for (int i = 0; i < MANDELBROT_STEPS; i++) {
        r = length(z);
        if (r > MAX_MANDELBROT_DIST) break;

        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        dr = pow(r, Power - 1.0) * Power * dr + 1.0;

        float zr = pow(r, Power);
        theta = theta * Power;
        phi = phi * Power;

        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += pos;
    }
    return vec2(0.5 * log(r) * r / dr, 50.0 * pow(dr, 0.128 / float(MARCHING_ITERATIONS)));
}

vec2 map(vec3 p) {
    vec2 d = DE(p);
    return d;
}

vec2 trace(vec3 origin, vec3 ray) {
    float t = 0.0;
    float c = 0.0;
    for (int i = 0; i < MARCHING_ITERATIONS; i++) {
        vec3 path = origin + ray * t;
        vec2 dist = map(path);
        t += MARCHING_STEP * dist.x;
        c += dist.y;
        if (dist.y < SMALLEST_STEP) break;
    }
    return vec2(t, c);
}

void main() {
    vec2 uv = 2.0 * vUv - 1.0;
    uv.x *= uResolution.x / uResolution.y;

    vec3 ray = normalize(vec3(uv, 1.0));

    float rotAngle = -3. * uMouse.x / uResolution.x + 0.4 + uTime / 40.0;
    ray.xz *= mat2(cos(rotAngle), -sin(rotAngle), sin(rotAngle), cos(rotAngle));

    float camDist = DISTANCE * 2. * uMouse.y / uResolution.y;
    if (uMouse == vec2(0.0)) camDist = DISTANCE * 0.55;
    vec3 origin = vec3(camDist * sin(rotAngle), 0.0, -camDist * cos(rotAngle));

    vec2 depth = trace(origin, ray);
    float fog = 1.0 / (1.0 + depth.x * depth.x * 0.1);

    vec3 fc = vec3(fog);

    gl_FragColor = vec4(palette(depth.y) * fog, 1.0);
}