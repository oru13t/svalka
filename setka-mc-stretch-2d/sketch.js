let sh, img, arrX = [], arrY = [], nx = 20, ny = 20

// Предотвращение скроллинга на мобильных устройствах
document.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });
document.body.style.overflow = 'hidden';

function preload(){
  sh = loadShader('shader.vert', 'shader.frag');
  img = loadImage('kamysh.jpg');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  pixelDensity(1);
}

function makeArrX(){
  let arr = [];
  for(let i = 0; i < nx; i++){
    let progress = i / nx;
    progress = schlick(progress, mouseX/width, .75);
    arr.push(progress);
  }
  return arr;
}

function makeArrY(){
  let arr = [];
  for(let i = 0; i < nx; i++){
    let progress = i / nx;
    progress = schlick(progress, 1-mouseY/width, .75);
    arr.push(progress);
  }
  return arr;
}

function schlick(x, t, s) {
  s = Math.pow(64, s * 2 - 1);
  if(t > x){
    return (t * x) / (x + s * (t - x) + 0.0001);
  }
  return ((1 - t) * (x - 1)) / (1 - x - s * (t - x) + 0.0001) + 1;
}

function draw() {
  // background(220);
  arrX = makeArrX(mouseX/width)
  arrY = makeArrY(1-mouseY/height)
  sh.setUniform('uResolution', [width, height]);
  sh.setUniform('uImage', img)
  sh.setUniform('uArrX', arrX)
  sh.setUniform('uArrY', arrY)
  sh.setUniform('uArrXLength', nx)
  sh.setUniform('uArrYLength', ny)
  shader(sh);
  plane(100, 100);
}