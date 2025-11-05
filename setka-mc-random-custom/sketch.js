let sh, img, arrX = []

for(let i = 0; i<10; i++){
  arrX.push(Math.random());
}
arrX.sort();

function preload(){
  sh = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  pixelDensity(1);
  
  // Настройка загрузки изображения
  const fileInput = select('#imageInput');
  fileInput.changed(handleFileSelect);
}

function handleFileSelect() {
  const fileInput = select('#imageInput');
  if (fileInput.elt.files && fileInput.elt.files[0]) {
    const file = fileInput.elt.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      loadImage(e.target.result, function(loadedImage) {
        img = loadedImage;
        redraw();
      });
    };
    reader.readAsDataURL(file);
  }
}

function draw() {
  background(220);
  if (img) {
    sh.setUniform('uResolution', [width, height]);
    sh.setUniform('uImage', img)
    sh.setUniform('uArrX', arrX)
    shader(sh);
    plane(100, 400);
  } else {
    // Показываем подсказку, если изображение не загружено
    resetShader();
    fill(100);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('Пожалуйста, загрузите изображение', 0, 0);
  }
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