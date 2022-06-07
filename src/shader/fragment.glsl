
uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

//  vec2 st = vUv + vec2(1.0, 0.0) * time * 0.5;
//  vec4 color = texture2D(albedo, st);
void main() {
  vec4 textureColor = texture2D(uTexture, vUv +  vec2(1.0, 0.0) * uTime  * 0.5);
  gl_FragColor = textureColor;
}
