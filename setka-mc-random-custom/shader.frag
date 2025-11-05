#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uResolution;
uniform sampler2D uImage;
uniform float[100] uArrX;

float map(float x,
          float scrStart, float scrEnd,
          float imgStart, float imgEnd){
  float phase = (x - scrStart)/(scrEnd - scrStart);
  return imgStart + phase*(imgEnd - imgStart);
}

void main(){
  vec2 uv = gl_FragCoord.xy/uResolution;
  
  float val = 0.;
  for(int idRight = 0; idRight < 10; idRight++){
    if(uv.x < uArrX[idRight]){
      int idLeft = idRight - 1;
      val = map(uv.x,
                uArrX[idLeft], uArrX[idRight],
                float(idLeft)/10.,
                float(idRight)/10.);
      break;
    }
  }
  
  uv.x = val;
  uv.y = 1. - uv.y;
  outColor = texture(uImage, uv);
}