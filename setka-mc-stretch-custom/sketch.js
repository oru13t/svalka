let sh, img, arrX = [], arrY = [], nx = 20, ny = 20

function preload(){
  sh = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight*0.5, WEBGL);
  pixelDensity(1);
  
  // Проверка протокола (предупреждение, если используется file://)
  if (window.location.protocol === 'file:') {
    console.warn('Внимание: Для работы на iOS необходимо использовать HTTP сервер (не file://)');
    // Показываем предупреждение пользователю
    setTimeout(function() {
      const warning = document.createElement('div');
      warning.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); z-index: 200; background: rgba(255, 200, 0, 0.95); padding: 15px 25px; border-radius: 10px; border: 2px solid #ff8800; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; text-align: center; max-width: 90%; box-shadow: 0 4px 15px rgba(0,0,0,0.3);';
      warning.innerHTML = '⚠️ Для работы на iPhone используйте HTTP сервер:<br><code style="background: rgba(0,0,0,0.1); padding: 4px 8px; border-radius: 4px; font-size: 12px;">python -m http.server 8000</code>';
      document.body.appendChild(warning);
      setTimeout(function() {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.5s';
        setTimeout(function() {
          warning.remove();
        }, 500);
      }, 5000);
    }, 1000);
  }
  
  // Настройка загрузки изображения
  const fileInput = select('#imageInput');
  const uploadLabel = select('#uploadLabel');
  
  // Обработка изменений через несколько событий для совместимости
  fileInput.changed(handleFileSelect);
  fileInput.elt.addEventListener('change', handleFileSelect, false);
  fileInput.elt.addEventListener('input', handleFileSelect, false);
  
  // Для iOS Safari - прямая обработка touchstart на input
  fileInput.elt.addEventListener('touchstart', function(e) {
    // Не блокируем событие, позволяем нативному поведению
    e.stopPropagation();
  }, { passive: true });
  
  // Также добавляем обработчик на label для надежности
  uploadLabel.elt.addEventListener('click', function(e) {
    // Позволяем нативному поведению label работать
  }, { passive: true });
  
  // Обработка изменения размера окна
  window.addEventListener('resize', function() {
    resizeCanvas(window.innerWidth, window.innerHeight*0.5);
  });
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

// function makeArrY(){
//   let arr = [];
//   for(let i = 0; i < nx; i++){
//     let progress = i / nx;
//     progress = schlick(progress, 1-mouseY/width, .75);
//     arr.push(progress);
//   }
//   return arr;
// }

function schlick(x, t, s) {
  s = Math.pow(64, s * 2 - 1);
  if(t > x){
    return (t * x) / (x + s * (t - x) + 0.0001);
  }
  return ((1 - t) * (x - 1)) / (1 - x - s * (t - x) + 0.0001) + 1;
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
          // Скрываем кнопку загрузки после успешной загрузки
          const uploadContainer = select('#uploadContainer');
          uploadContainer.style('opacity', '0');
          uploadContainer.style('pointer-events', 'none');
          uploadContainer.style('transition', 'opacity 0.3s ease');
          setTimeout(function() {
            uploadContainer.style('display', 'none');
          }, 300);
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
  if (img) {
    arrX = makeArrX(mouseX/width)
    // arrY = makeArrY(1-mouseY/height)
    sh.setUniform('uResolution', [width, height]);
    sh.setUniform('uImage', img)
    sh.setUniform('uArrX', arrX)
    // sh.setUniform('uArrY', arrY)
    sh.setUniform('uArrXLength', nx)
    // sh.setUniform('uArrYLength', ny)
    shader(sh);
    plane(100, 100);
  } else {
    // Показываем подсказку, если изображение не загружено
    resetShader();
    fill(100);
    textSize(min(width, height) * 0.04);
    textAlign(CENTER, CENTER);
    text('Пожалуйста, загрузите изображение', 0, 0);
  }
}