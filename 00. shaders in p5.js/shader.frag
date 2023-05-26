#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec2 vCenteredUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uMic;

void main() {
    // polar coordinates
    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv = vUv * aspectRatio;
    float numCells = 10.;
    vec2 cell = floor(uv * numCells);
    uv = fract(uv * numCells);
    uv -= 0.5;
    float r = length(uv);
    float theta = atan(uv.y, uv.x);
    float result = cos((uMic * 100. + r) * 50. - (uTime * (1. + 0.5 * fract(length(cell) * 12321.))));


    vec3 color0 = vec3(uMouse.x, 0.5, 0.5);
    vec3 color1 = vec3(0.8, 0.0, 0.65);
    vec3 color2 = vec3(0.5, 1.0, 0.0);
    vec3 color3 = vec3(uMouse.y, 0.5, 1.0);

    vec3 colorA = mix(color0, color1, fract(cell.x * 12321.5679876));
    vec3 colorB = mix(color2, color3, fract(cell.y * 12321.34567654));

    vec3 finalColor = mix(colorA, colorB, result);

    gl_FragColor = vec4(finalColor, 1.0);
}