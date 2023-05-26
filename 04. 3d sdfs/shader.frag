#ifdef GL_ES
precision mediump float;
#endif

precision mediump float;

varying vec2 vUv;
uniform float uTime;

const int MAX_STEPS = 100;
const float DIST_THRESHOLD = 0.01;
const float MAX_DIST = 100.0;

// Shape SDFs
// Look here for more: https://iquilezles.org/articles/distfunctions/

float dSphere(vec3 point, vec3 center, float radius) {
    return length(point - center) - radius;
}

float sdBox( vec3 p, vec3 b )
{
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdTorus( vec3 p, vec2 t ) {
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return length(q)-t.y;
}

float sdCappedCylinder( vec3 p, vec3 a, vec3 b, float r )
{
    vec3  ba = b - a;
    vec3  pa = p - a;
    float baba = dot(ba,ba);
    float paba = dot(pa,ba);
    float x = length(pa*baba-ba*paba) - r*baba;
    float y = abs(paba-baba*0.5)-baba*0.5;
    float x2 = x*x;
    float y2 = y*y*baba;
    float d = (max(x,y)<0.0)?-min(x2,y2):(((x>0.0)?x2:0.0)+((y>0.0)?y2:0.0));
    return sign(d)*sqrt(abs(d))/baba;
}

// Shape operations

float intersection(float distA, float distB) {
    return max(distA, distB);
}

float union(float distA, float distB) {
    return min(distA, distB);
}

float difference(float distA, float distB) {
    return max(distA, -distB);
}

// Add shapes and operations here!
float scene(vec3 point) {
    float distance = 0;
    distance += dSphere(point, vec3(0, 0, 0), 1.0);
    return distance;
}

vec3 getNormal(vec3 point) {
    float dist = scene(point);
    vec2 e = vec2(0.01, 0.0);

    vec3 n = dist - vec3(
        scene(point - e.xyy),
        scene(point - e.yxy),
        scene(point - e.yyx)
    );

    return normalize(n);
}

float raymarch(vec3 origin, vec3 direction) {
    float totalDistance = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 point = origin + direction * totalDistance;
        float dist = scene(point);
        totalDistance += dist;
        if(abs(dist) < DIST_THRESHOLD) {
            return totalDistance;
        }
        if(totalDistance > MAX_DIST) {
            return MAX_DIST;
        }
    }
    return totalDistance;
}

vec3 getLight(vec3 point, vec3 normal) {
    vec3 lightPosition = vec3(0, 5.0, 5.0);
    vec3 lightDirection = normalize(lightPosition - point);
    float diffuse = max(0.0, dot(normal, lightDirection));
    return vec3(diffuse);
}

void main(void) {
    vec3 cameraPosition = vec3(0, 0, 5);
    vec3 rayDirection = normalize(vec3(vUv - 0.5, -1.0));

    float totalDistance = raymarch(cameraPosition, rayDirection);
    vec3 point = cameraPosition + rayDirection * totalDistance;
    vec3 normal = getNormal(point);
    vec3 light = getLight(point, normal);
    vec3 color = vec3(0.5, 0.1, 0.9);
    vec3 litColor = color * light;
    
    gl_FragColor = vec4(litColor, 1.0);
}
