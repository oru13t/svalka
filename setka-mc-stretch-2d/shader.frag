#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uResolution;
uniform sampler2D uImage;
uniform float[100] uArrX;
uniform int uArrXLength;
uniform float[100] uArrY;
uniform int uArrYLength;

float map(float x,
          float scrStart, float scrEnd,
          float imgStart, float imgEnd){
  float phase = (x - scrStart)/(scrEnd - scrStart);
  //phase=sin(phase*3.14+11.)*.5+.5;
  
  return imgStart + phase*(imgEnd - imgStart);
}

void main(){
  vec2 uv = gl_FragCoord.xy/uResolution;
  
  float valX = 0.;
  for(int idRight = 0; idRight < uArrXLength; idRight++){
    if(uv.x < uArrX[idRight]){
      float pxWidth = 1./uResolution.x;
      int idLeft = idRight - 1;
      valX = map(uv.x,
                uArrX[idLeft], uArrX[idRight],
                float(idLeft)/float(uArrXLength),
                float(idRight)/float(uArrXLength)
               );
      break;
    }
  }
  
  
  float valY = 0.;
  for(int idRight = 0; idRight < uArrYLength; idRight++){
    if(uv.y < uArrY[idRight]){
      float pxWidth = 1./uResolution.y;
      int idLeft = idRight - 1;
      valY = map(uv.y,
                uArrY[idLeft], uArrY[idRight],
                float(idLeft)/float(uArrYLength),
                float(idRight)/float(uArrYLength)
               );
      break;
    }
  }
  
  
  uv.x = valX;
  uv.y = 1.0 - valY;
  outColor = texture(uImage, uv);
}