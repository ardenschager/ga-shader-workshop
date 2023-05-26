#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;

// credit: https://www.shadertoy.com/view/4df3Rn

#define MAX_ITER 100
#define C_RE -0.8
#define C_IM 0.156

// https://github.com/Erkaman/glsl-cos-palette
// https://iquilezles.org/articles/palettes/
vec3 cosPalette(  float t,  vec3 a,  vec3 b,  vec3 c, vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

float mandelbrot(vec2 uv) {
    vec2 coord = (uv * uResolution - 0.5 * uResolution) / min(uResolution.x,uResolution.y);
    vec2 c = 2.0 * coord;
    c.x -= 0.5;
    c *= (1. + 0.25 * sin(uTime));
    vec2 z = vec2(0.0);
    float iter = 0.0;
    for(int i = 0; i < MAX_ITER; i++) {
        if(dot(z, z) > 4.0) break;
        vec2 temp = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        z = temp;
        iter++;
    }
  
    return iter/float(MAX_ITER);
}

float julia(vec2 uv) {
    vec2 z = 2.0*(uv * uResolution - 0.5*uResolution)/min(uResolution.x,uResolution.y);
    z.x -= 0.5;
    vec2 c = vec2(C_RE, C_IM);
    float iter = 0.0;

    for(int i = 0; i < MAX_ITER; i++) {
        if(dot(z, z) > 4.0) break;
        vec2 temp = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        z = temp;
        iter++;
    }
    return iter/float(MAX_ITER);
}

void main() {
    float result = mandelbrot(vUv);
    vec3 finalColor = cosPalette(result, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67));
    gl_FragColor = vec4(finalColor, 1.0);
}
