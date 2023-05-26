#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

const int MAX_ITERATIONS = 64;
const float MARCHING_STEP = 0.5;
const float MINIMUM_STEP = 0.1;
const float MAX_DISTANCE = 3.0;
const float MAX_MANDELBROT_DISTANCE = 1.5;

float calculatePower() {
    return 3.0 + 4.0 * (sin(uTime / 30.0) + 1.0);
}

vec2 calculateFractal(vec3 position) {
    float power = calculatePower();
    vec3 z = position;
    float derivative = 1.0;
    float r = 0.0;

    for (int i = 0; i < MAX_ITERATIONS; i++) {
        r = length(z);
        if (r > MAX_MANDELBROT_DISTANCE) break;

        float theta = acos(z.z / r);
        float phi = atan(z.y, z.x);
        derivative = pow(r, power - 1.0) * power * derivative + 1.0;

        float zr = pow(r, power);
        theta *= power;
        phi *= power;

        z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
        z += position;
    }

    return vec2(0.5 * log(r) * r / derivative, 50.0 * pow(derivative, 0.128 / float(MAX_ITERATIONS)));
}

float rayMarch(vec3 origin, vec3 direction) {
    float t = 0.0;
    float color = 0.0;
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        vec3 position = origin + direction * t;
        vec2 result = calculateFractal(position);
        t += MARCHING_STEP * result.x;
        color += result.y;
        if (result.y < MINIMUM_STEP) break;
    }
    return color;
}

void main() {
    vec2 uv = 2.0 * vUv - 1.0;
    uv.x *= uResolution.x / uResolution.y;
    vec3 rayDirection = normalize(vec3(uv, 1.0));

    float rotationAngle = -3. * uMouse.x / uResolution.x + 0.4 + uTime / 40.0;
    rayDirection.xz *= mat2(cos(rotationAngle), -sin(rotationAngle), sin(rotationAngle), cos(rotationAngle));

    float cameraDistance = MAX_DISTANCE * 2. * uMouse.y / uResolution.y;
    if (uMouse == vec2(0.0)) cameraDistance = MAX_DISTANCE * 0.55;
    vec3 cameraPosition = vec3(cameraDistance * sin(rotationAngle), 0.0, -cameraDistance * cos(rotationAngle));

    float totalDistance = rayMarch(cameraPosition, rayDirection);
    float fog = 1.0 / (1.0 + totalDistance * totalDistance * 0.1);

    vec3 color = vec3(0.5, 0.5, 0.5);
    vec3 litColor = color * fog;
    
    gl_FragColor = vec4(litColor, 1.0);
}
