#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vUv;
varying vec2 vCenteredUv;

void main() {
    vUv = vec2(aTexCoord.x, aTexCoord.y);
    vCenteredUv = vec2(aTexCoord.x - 0.5, aTexCoord.y - 0.5) * 2.0;
    // vUv = vec2(aTexCoord.x, 1. - aTexCoord.y);
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
}