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
  pixelDensity(displayDensity());
  
  // Настройка загрузки изображения
  const fileInput = select('#imageInput');
  const uploadLabel = select('#uploadLabel');
  
  // Обработка изменений через несколько событий для совместимости
  fileInput.changed(handleFileSelect);
  fileInput.elt.addEventListener('change', handleFileSelect, false);
  
  // Нативный label должен работать, но добавляем обработчик для надежности
  uploadLabel.elt.addEventListener('touchstart', function(e) {
    // Для iOS Safari нужно явно вызвать click
    setTimeout(function() {
      fileInput.elt.click();
    }, 100);
  }, { passive: true });
  
  // Обработка изменения размера окна
  window.addEventListener('resize', function() {
    resizeCanvas(window.innerWidth, window.innerHeight);
  });
}

function handleFileSelect(event) {
  const fileInput = select('#imageInput');
  const file = fileInput.elt.files && fileInput.elt.files[0];
  
  if (!file) {
    // Также попробуем получить файл из события
    if (event && event.target && event.target.files && event.target.files[0]) {
      const fileFromEvent = event.target.files[0];
      loadImageFromFile(fileFromEvent);
    }
    return;
  }
  
  loadImageFromFile(file);
}

function loadImageFromFile(file) {
  // Проверяем, что это изображение
  if (!file.type.match('image.*')) {
    alert('Пожалуйста, выберите файл изображения');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      loadImage(e.target.result, function(loadedImage) {
        if (loadedImage) {
          img = loadedImage;
          // Обновляем label после загрузки
          const uploadLabel = select('#uploadLabel');
          uploadLabel.html('<span>✓ Изображение загружено<br>Нажмите для замены</span>');
          uploadLabel.style('font-size', '16px');
          redraw();
        } else {
          alert('Ошибка загрузки изображения');
        }
      }, function(error) {
        console.error('Ошибка загрузки изображения:', error);
        alert('Не удалось загрузить изображение');
      });
    } catch (error) {
      console.error('Ошибка при обработке файла:', error);
      alert('Ошибка при обработке файла');
    }
  };
  
  reader.onerror = function() {
    alert('Ошибка чтения файла');
  };
  
  reader.readAsDataURL(file);
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
    textSize(min(width, height) * 0.04);
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