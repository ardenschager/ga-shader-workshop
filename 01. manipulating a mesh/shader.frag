#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 vNormal;
uniform vec2 uResolution;

void main() {
    gl_FragColor = vec4(vNormal, 1.0);
}