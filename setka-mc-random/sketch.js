let sh, img, arrX = []

for(let i = 0; i<10; i++){
  arrX.push(Math.random());
}
arrX.sort();

function preload(){
  sh = loadShader('shader.vert', 'shader.frag');
  img = loadImage('kamysh.jpg');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  pixelDensity(1);
}

function draw() {
  background(220);
  sh.setUniform('uResolution', [width, height]);
  sh.setUniform('uImage', img)
  sh.setUniform('uArrX', arrX)
  shader(sh);
  plane(100, 400);
}

function generateNewArrX() {
  arrX = [];
  for(let i = 0; i<10; i++){
    arrX.push(Math.random());
  }
  arrX.sort();
}

function mousePressed() {
  generateNewArrX();
  redraw();
}

function touchStarted() {
  generateNewArrX();
  redraw();
  return false; // Предотвращаем стандартное поведение касания
}