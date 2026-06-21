// ─────────────────────────────────────────────────────────
// Fieldcraft OS — shader library
// All fragment shaders share these uniforms:
//   u_res        viewport (px)
//   u_time       seconds (scaled by tweaks.speed)
//   u_mouse      smoothed cursor in 0..1, y-up
//   u_mouseRaw   instant cursor (0..1)
//   u_clicks[8]  vec4(x, y, age_seconds, _)   age = -1 means slot empty
//   u_pull       0..1   strength of cursor influence
//   u_detail     ~0.5..1.8 multiplier on procedural complexity
//   u_palette    0..3 selector
// ─────────────────────────────────────────────────────────

const COMMON_HEADER = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform vec2  u_mouseRaw;
uniform float u_time;
uniform vec4  u_clicks[8];
uniform float u_pull;
uniform float u_detail;
uniform int   u_palette;
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

// 2x2 rotation
mat2 rot(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }

// Palettes return three colors: deep, mid, hi.
void getPalette(out vec3 c0, out vec3 c1, out vec3 c2){
  if (u_palette==1){           // Parchment Gold
    c0 = vec3(0.10,0.10,0.094);
    c1 = vec3(0.78,0.66,0.43);
    c2 = vec3(0.96,0.945,0.92);
  } else if (u_palette==2){    // Cobalt
    c0 = vec3(0.039,0.094,0.188);
    c1 = vec3(0.231,0.435,0.722);
    c2 = vec3(0.604,0.851,1.000);
  } else if (u_palette==3){    // Magenta Bloom
    c0 = vec3(0.102,0.039,0.122);
    c1 = vec3(0.655,0.188,0.478);
    c2 = vec3(1.000,0.714,0.902);
  } else {                     // Verdant (default)
    c0 = vec3(0.059,0.169,0.118);
    c1 = vec3(0.114,0.620,0.459);
    c2 = vec3(0.365,0.792,0.647);
  }
}

// Mix three palette colors by t in 0..1.
vec3 paletteMix(float t){
  vec3 c0,c1,c2; getPalette(c0,c1,c2);
  t = clamp(t, 0.0, 1.0);
  return t < 0.5
    ? mix(c0, c1, smoothstep(0.0, 0.5, t))
    : mix(c1, c2, smoothstep(0.5, 1.0, t));
}

// Sums clicks: returns vec2(strength, age) where strength is 0..1 falloff
// based on radial wave centered on the click. Used for ring pulses.
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

// Returns total proximity influence from active clicks; 0..N.
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
`;

// ─── full-screen vertex shader (WebGL2) ───
const VS = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main(){
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// ═══════════════════════════════════════════════════════════
// 1. VERDANT AURORA
// ═══════════════════════════════════════════════════════════
const FS_AURORA = COMMON_HEADER + `
in vec2 v_uv;

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
}
`;

// ═══════════════════════════════════════════════════════════
// 2. LIQUID MERCURY (metaballs)
// ═══════════════════════════════════════════════════════════
const FS_MERCURY = COMMON_HEADER + `
in vec2 v_uv;

float metafield(vec2 p){
  vec2 m = u_mouse; m.x *= u_res.x/u_res.y;
  float t = u_time * 0.5;

  // primary cursor blob
  float f = 0.0;
  f += 0.16 / (length(p - m) + 0.02);

  // 5 orbiting blobs
  for (int i=0; i<5; i++){
    float fi = float(i);
    float a = t * (0.4 + fi*0.13) + fi*1.7;
    float radius = 0.28 + 0.12*sin(t*0.6 + fi);
    vec2 c = m + vec2(cos(a), sin(a*1.1)) * radius;
    f += 0.10 / (length(p - c) + 0.025);
  }

  // click blobs (fade out)
  for (int i=0; i<8; i++){
    vec4 c = u_clicks[i];
    if (c.z < 0.0) continue;
    float age = c.z;
    float life = 2.5;
    if (age > life) continue;
    vec2 cp = c.xy; cp.x *= u_res.x/u_res.y;
    float rage = 1.0 - age/life;
    float radius = age * 0.4;
    float spread = 0.04 + radius*radius*0.5;
    f += 0.16 * rage / (length(p - cp) + 0.025 + spread);
  }
  return f;
}

void main(){
  vec2 uv = v_uv;
  vec2 p = uv;
  p.x *= u_res.x/u_res.y;

  float f = metafield(p);

  // gradient for shading
  float e = 0.0025;
  float fx = metafield(p + vec2(e,0.0)) - metafield(p - vec2(e,0.0));
  float fy = metafield(p + vec2(0.0,e)) - metafield(p - vec2(0.0,e));
  vec2 grad = vec2(fx, fy) / (2.0*e);

  // surface mask
  float threshold = 1.6;
  float surface = smoothstep(threshold-0.18, threshold+0.18, f);
  float interior = smoothstep(threshold-0.6, threshold+0.4, f);

  // shading
  vec3 light = normalize(vec3(0.4, 0.7, 1.0));
  vec3 n = normalize(vec3(-grad, 0.6));
  float lambert = clamp(dot(n, light), 0.0, 1.0);
  float spec = pow(clamp(dot(reflect(-light, n), vec3(0,0,1)), 0.0, 1.0), 24.0);

  // base color from palette + position
  vec3 base = paletteMix(0.25 + 0.55*lambert + 0.15*sin(u_time*0.3 + p.y*4.0));
  vec3 dark = paletteMix(0.05);
  vec3 col = mix(dark, base, interior);
  col += spec * vec3(1.0) * surface * 0.6;

  // chrome rim near surface threshold
  float rim = exp(-pow((f - threshold)*4.0, 2.0));
  col += paletteMix(0.95) * rim * 0.35;

  // background swirl
  float bg = fbm(p*1.4 + u_time*0.05);
  vec3 bgCol = paletteMix(bg*0.35);
  col = mix(bgCol*0.5, col, interior);

  // vignette
  float vig = smoothstep(1.3, 0.4, length(uv-0.5));
  col *= mix(0.85, 1.0, vig);

  outColor = vec4(col, 1.0);
}
`;

// ═══════════════════════════════════════════════════════════
// 3. CELLULAR BLOOM (voronoi)
// ═══════════════════════════════════════════════════════════
const FS_VORONOI = COMMON_HEADER + `
in vec2 v_uv;

// returns vec3(F1, F2, cellId)
vec3 voronoi(vec2 x){
  vec2 n = floor(x);
  vec2 f = fract(x);

  float F1 = 8.0, F2 = 8.0;
  float id = 0.0;

  for (int j=-1;j<=1;j++)
  for (int i=-1;i<=1;i++){
    vec2 g = vec2(float(i),float(j));
    vec2 o = hash22(n+g);
    o = 0.5 + 0.5*sin(u_time*0.7 + 6.283*o);
    vec2 r = g + o - f;
    float d = dot(r,r);
    if (d < F1){
      F2 = F1; F1 = d;
      id = hash21(n+g);
    } else if (d < F2){
      F2 = d;
    }
  }
  return vec3(sqrt(F1), sqrt(F2), id);
}

void main(){
  vec2 uv = v_uv;
  vec2 p = uv;
  p.x *= u_res.x/u_res.y;

  vec2 m = u_mouse; m.x *= u_res.x/u_res.y;
  float distM = length(p - m);

  // cursor warp toward the cells near it
  vec2 dir = (m - p);
  vec2 warped = p + dir * exp(-distM*3.5) * 0.25 * u_pull;

  vec3 v = voronoi(warped * (5.0 * u_detail));
  float ridge = smoothstep(0.0, 0.04, v.y - v.x);
  float cellInner = 1.0 - smoothstep(0.0, 0.45, v.x);

  // brighten cells near cursor
  float prox = exp(-distM*2.5);
  float bloom = clickField(uv, 3.0);

  // click pulse "wavefront" boosts ridges
  float wave = clickWave(uv, 0.7, 0.05);

  // color
  float t = cellInner * 0.55 + prox * 0.35 * u_pull + bloom * 0.5 + v.z * 0.15;
  vec3 col = paletteMix(t);
  // ridge as high-contrast veins
  col = mix(col, paletteMix(0.95), (1.0 - ridge) * 0.5);
  // wave hue lift
  col += paletteMix(0.9) * wave * 0.65;

  // soft cursor glow
  col += paletteMix(0.85) * exp(-distM*5.0) * 0.18 * u_pull;

  // film grain
  float grain = (hash21(uv*u_res + u_time*60.0) - 0.5) * 0.03;
  col += grain;

  outColor = vec4(col, 1.0);
}
`;

// ═══════════════════════════════════════════════════════════
// 4. TOPOGRAPHY (contour lines + gravity well)
// ═══════════════════════════════════════════════════════════
const FS_TOPO = COMMON_HEADER + `
in vec2 v_uv;

float field(vec2 p){
  vec2 m = u_mouse; m.x *= u_res.x/u_res.y;
  vec2 dM = p - m;
  float dist = length(dM);

  // gravity well: warp coords toward cursor
  vec2 warp = -normalize(dM + 1e-4) * u_pull * 0.22 / (dist*dist + 0.18);
  vec2 q = (p + warp) * (2.2 * u_detail);

  float t = u_time * 0.10;
  float n = fbm(q + vec2(t, -t*0.5));
  // ridge from cursor
  n += exp(-dist*2.0) * 0.6 * u_pull;

  // click ripple bumps the field
  for (int i=0; i<8; i++){
    vec4 c = u_clicks[i];
    if (c.z < 0.0) continue;
    float age = c.z;
    float life = 2.4;
    if (age > life) continue;
    vec2 cp = c.xy; cp.x *= u_res.x/u_res.y;
    float r = length(p - cp);
    float front = age * 0.55;
    float ring = exp(-pow((r-front)/0.06, 2.0));
    float decay = 1.0 - age/life;
    n += ring * decay * 0.45;
  }
  return n;
}

void main(){
  vec2 uv = v_uv;
  vec2 p = uv;
  p.x *= u_res.x/u_res.y;

  float n = field(p);

  // contour lines at fract intervals
  float layers = 14.0;
  float h = n * layers;
  float line = abs(fract(h) - 0.5);
  // anti-aliased line based on derivative
  float fw = fwidth(h);
  float contour = 1.0 - smoothstep(0.0, fw*1.5, line - 0.02);

  // major contour every 5 lines
  float major = 1.0 - smoothstep(0.0, fw*1.5, abs(fract(h*0.2) - 0.5) - 0.02);

  // base color: gradient over n value
  vec3 base = paletteMix(n*0.85);

  // line color (brighter)
  vec3 lineCol = paletteMix(0.95);
  vec3 majorCol = paletteMix(1.0);

  vec3 col = base * 0.55;
  col = mix(col, lineCol, contour * 0.85);
  col = mix(col, majorCol, major * 0.55);

  // cursor glow
  vec2 m = u_mouse; m.x *= u_res.x/u_res.y;
  float dM = length(p - m);
  col += paletteMix(0.95) * exp(-dM*4.0) * 0.25 * u_pull;

  // crosshair tick at cursor
  vec2 dPx = (uv - u_mouse) * u_res;
  float chV = exp(-pow(dPx.x, 2.0)*0.0008) * smoothstep(40.0, 6.0, abs(dPx.y));
  float chH = exp(-pow(dPx.y, 2.0)*0.0008) * smoothstep(40.0, 6.0, abs(dPx.x));
  col += paletteMix(1.0) * (chV+chH) * 0.18;

  outColor = vec4(col, 1.0);
}
`;

// ═══════════════════════════════════════════════════════════
// 5. STARDUST VORTEX
// ═══════════════════════════════════════════════════════════
const FS_VORTEX = COMMON_HEADER + `
in vec2 v_uv;

float stars(vec2 p, float scale){
  vec2 g = floor(p*scale);
  vec2 f = fract(p*scale);
  float v = 0.0;
  for (int j=-1;j<=1;j++)
  for (int i=-1;i<=1;i++){
    vec2 o = vec2(float(i),float(j));
    vec2 h = hash22(g+o);
    if (h.x < 0.92) continue; // sparse
    vec2 c = o + 0.2 + 0.6*hash22(g+o+11.3) - f;
    float d = length(c);
    float twinkle = 0.5 + 0.5*sin(u_time*(2.0 + h.y*4.0) + h.x*30.0);
    v += smoothstep(0.06, 0.0, d) * twinkle;
  }
  return v;
}

vec3 sampleField(vec2 uv, float chromaShift){
  vec2 p = uv;
  p.x *= u_res.x/u_res.y;

  vec2 m = u_mouse; m.x *= u_res.x/u_res.y;
  vec2 d = p - m;
  float r = length(d);
  float ang = atan(d.y, d.x);

  // swirl: twist angle by 1/r near cursor
  float twist = u_pull * 1.6 / (r*1.5 + 0.4) - u_time*0.18;
  ang += twist;
  vec2 swirled = m + vec2(cos(ang), sin(ang)) * r;

  // click radial shockwave displaces uv
  for (int i=0; i<8; i++){
    vec4 c = u_clicks[i];
    if (c.z < 0.0) continue;
    float age = c.z;
    float life = 1.8;
    if (age > life) continue;
    vec2 cp = c.xy; cp.x *= u_res.x/u_res.y;
    vec2 dd = swirled - cp;
    float rr = length(dd);
    float front = age * 0.7;
    float push = exp(-pow((rr-front)/0.08, 2.0)) * (1.0 - age/life) * 0.08;
    swirled += normalize(dd+1e-4) * push;
  }

  // chromatic separation
  vec2 cdir = normalize(d + 1e-4) * chromaShift;
  vec2 sp = swirled + cdir;

  // layered stars
  float s1 = stars(sp * (1.0*u_detail), 8.0) * 0.7;
  float s2 = stars(sp*1.7 + 13.0, 14.0) * 0.5;
  float s3 = stars(sp*2.7 + 31.0, 22.0) * 0.35;

  // dust nebula
  float n = fbm(sp*1.3 + u_time*0.04);
  float dust = smoothstep(0.35, 0.95, n + 0.25*exp(-r*2.0)*u_pull);

  vec3 col = paletteMix(dust*0.7) * 0.6;
  col += paletteMix(0.92) * (s1 + s2 + s3);
  return col;
}

void main(){
  vec2 uv = v_uv;
  vec2 p = uv; p.x *= u_res.x/u_res.y;
  vec2 m = u_mouse; m.x *= u_res.x/u_res.y;
  float r = length(p - m);
  float chroma = (0.004 + 0.012*exp(-r*2.5)) * u_pull;

  vec3 colR = sampleField(uv, +chroma);
  vec3 colG = sampleField(uv, 0.0);
  vec3 colB = sampleField(uv, -chroma);

  vec3 col = vec3(colR.r, colG.g, colB.b);

  // subtle vignette
  float vig = smoothstep(1.3, 0.3, length(uv-0.5));
  col *= mix(0.7, 1.0, vig);

  outColor = vec4(col, 1.0);
}
`;

// ─── shader registry ───
window.SHADERS = [
  {
    id: 'aurora',
    name: 'Verdant Aurora',
    desc: 'Layered field noise drifts through verdant ribbons. Move the cursor to bend the field; click to release a hue wave that travels outward.',
    fs: FS_AURORA,
    swatch: ['#0F2B1E', '#1D9E75', '#5DCAA5'],
  },
  {
    id: 'mercury',
    name: 'Liquid Mercury',
    desc: 'Raymarched metaballs follow the cursor in a slow orbit. Click to splash a new blob — it grows, decays, and merges back into the field.',
    fs: FS_MERCURY,
    swatch: ['#0F2B1E', '#5DCAA5', '#F5F1EB'],
  },
  {
    id: 'voronoi',
    name: 'Cellular Bloom',
    desc: 'Animated voronoi cells. Cells near the cursor brighten and bend toward you; click to bloom a wavefront across the lattice.',
    fs: FS_VORONOI,
    swatch: ['#143326', '#1D9E75', '#9FE1CB'],
  },
  {
    id: 'topo',
    name: 'Topography',
    desc: 'Contour lines on a noise field. The cursor opens a gravity well that bends elevation toward you; clicks send concentric ripples through the map.',
    fs: FS_TOPO,
    swatch: ['#0F2B1E', '#C8A96E', '#F5F1EB'],
  },
  {
    id: 'vortex',
    name: 'Stardust Vortex',
    desc: 'Layered stars and dust swirl around the cursor with chromatic aberration. Click to release a shockwave that ripples through the field.',
    fs: FS_VORTEX,
    swatch: ['#0a1830', '#3b6fb8', '#9ad9ff'],
  },
];

window.VS = VS;
