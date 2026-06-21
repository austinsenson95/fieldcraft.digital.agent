// ─────────────────────────────────────────────────────────
// Fieldcraft OS — Verdant Aurora Shader
// Simplified for hero background use
// ─────────────────────────────────────────────────────────

export const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main(){
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;
in vec2 v_uv;

uniform vec2  u_res;
uniform vec2  u_mouse;
uniform float u_time;
uniform vec4  u_clicks[8];
uniform float u_pull;
uniform float u_detail;
uniform float u_dpi;

// ─── helpers ───
float hash11(float p){ p = fract(p*0.1031); p *= p+33.33; p *= p+p; return fract(p); }
float hash21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2  hash22(vec2 p){
  vec3 p3 = fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));
  p3 += dot(p3, p3.yzx+33.33);
  return fract((p3.xx+p3.yz)*p3.zy);
}

// 2D value noise
float vnoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i+vec2(1,0));
  float c = hash21(i+vec2(0,1));
  float d = hash21(i+vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i=0; i<5; i++){
    v += a * vnoise(p);
    p = p * 2.02 + 7.31;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

// Palette: deep, mid, hi
void getPalette(out vec3 c0, out vec3 c1, out vec3 c2){
  c0 = vec3(0.059,0.169,0.118);
  c1 = vec3(0.114,0.620,0.459);
  c2 = vec3(0.365,0.792,0.647);
}

vec3 paletteMix(float t){
  vec3 c0,c1,c2; getPalette(c0,c1,c2);
  t = clamp(t, 0.0, 1.0);
  return t < 0.5
    ? mix(c0, c1, smoothstep(0.0, 0.5, t))
    : mix(c1, c2, smoothstep(0.5, 1.0, t));
}

float clickWave(vec2 uv, float speed, float thickness){
  float v = 0.0;
  for (int i=0; i<8; i++){
    vec4 c = u_clicks[i];
    if (c.z < 0.0) continue;
    float age = c.z;
    float life = 1.6;
    if (age > life) continue;
    vec2 d = uv - c.xy;
    d.x *= u_res.x/u_res.y;
    float r = length(d);
    float wavefront = age * speed;
    float ring = exp(-pow((r - wavefront)/thickness, 2.0));
    float decay = 1.0 - age/life;
    v += ring * decay;
  }
  return v;
}

float clickField(vec2 uv, float falloff){
  float v = 0.0;
  for (int i=0; i<8; i++){
    vec4 c = u_clicks[i];
    if (c.z < 0.0) continue;
    float age = c.z;
    float life = 2.0;
    if (age > life) continue;
    vec2 d = uv - c.xy;
    d.x *= u_res.x/u_res.y;
    float r = length(d);
    float decay = 1.0 - age/life;
    v += exp(-r * falloff) * decay;
  }
  return v;
}

void main(){
  vec2 uv = v_uv;
  vec2 p = uv;
  p.x *= u_res.x/u_res.y;

  // mouse warp — pull field toward cursor
  vec2 m = u_mouse;
  m.x *= u_res.x/u_res.y;
  vec2 dM = p - m;
  float dist = length(dM);
  vec2 warp = -normalize(dM + 1e-4) * u_pull * 0.18 / (dist + 0.4);

  // ribbons via stacked fbm offsets
  float t = u_time * 0.18;
  vec2 q = (p + warp) * (1.4 * u_detail);
  float n1 = fbm(q + vec2(0.0, t));
  float n2 = fbm(q*1.7 + vec2(t*0.6, -t*0.4) + n1);
  float n3 = fbm(q*2.4 - vec2(-t*0.3, t*0.2) + n2*1.2);

  // vertical ribbons centered around midline, modulated by noise
  float band = sin( (uv.y * 3.2 - 1.2) + n3*3.5 + t*0.4 );
  float ribbon = smoothstep(0.05, 0.9, n2 + band*0.35);

  // click hue wave
  float wave = clickWave(uv, 0.55, 0.04);
  float cfield = clickField(uv, 4.0);

  float intensity = ribbon + wave*0.8 + cfield*0.25;

  // base palette mix from ribbon
  vec3 col = paletteMix(intensity * 0.95);

  // glow near cursor
  float glow = exp(-dist*3.5) * (0.45 + 0.5*u_pull);
  col += paletteMix(0.85) * glow * 0.55;

  // soft vignette + grain
  float vig = smoothstep(1.4, 0.4, length(uv-0.5));
  col *= mix(0.78, 1.0, vig);
  float grain = (hash21(uv * u_res + u_time) - 0.5) * 0.025;
  col += grain;

  outColor = vec4(col, 1.0);
}`;
