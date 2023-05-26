let myShader;

function preload() {
    myShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight + 1, WEBGL);
    // hide scrollbar
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    myShader.setUniform('uResolution', [windowWidth, windowHeight]);

    document.body.scroll = "no"; // ie only
}

function draw() {
    background([0, 0, 0]);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    shader(myShader);
    noStroke();
    // model(bunny);
    sphere(200);
    myShader.setUniform('uTime', frameCount * 0.05);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight + 1);
    myShader.setUniform('uResolution', [windowWidth, windowHeight]);
}

function keyPressed() {
    if (keyCode === 70) { // F
        let fs = fullscreen();
        fullscreen(!fs);
    }
}