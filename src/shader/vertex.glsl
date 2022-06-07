

varying vec2 vUv;


float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.54531223);
}
void main() {
  vec4 modelPos = modelMatrix * vec4(position, 1.0);
  // modelPos.z += sin(random(uv));
  vec4 viewPos = viewMatrix * modelPos;
  vec4 projectionPos = projectionMatrix * viewPos;
  gl_Position = projectionPos;

  vUv = uv;
}
