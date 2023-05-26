let myShader;
let mic;

function preload() {
    myShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight + 1, WEBGL);
    shader(myShader);
    myShader.setUniform('uResolution', [windowWidth, windowHeight]);
    noStroke();
    // turn on mic
    mic = new p5.AudioIn();
    mic.start();
    // hide scrollbar
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}

function draw() {
    myShader.setUniform('uTime', frameCount * 0.01);
    myShader.setUniform('uMouse', [mouseX / windowWidth, mouseY / windowHeight]);
    // myShader.setUniform('uMic', mic.getLevel());
    // console.log(mic.getLevel());
    rect(-windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);
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