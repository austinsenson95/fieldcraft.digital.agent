// ─────────────────────────────────────────────────────────
// Fieldcraft OS runtime
// WebGL2 full-screen quad. Compiles + caches one program per shader.
// ─────────────────────────────────────────────────────────

(function () {
  const canvas = document.getElementById('gl');
  const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) {
    document.body.innerHTML = '<div style="padding:40px;font-family:monospace;color:#F5F1EB;background:#0F2B1E;height:100vh">WebGL2 not supported in this browser.</div>';
    return;
  }

  // ─── compile helpers ───
  function compile(src, type) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:\n' + gl.getShaderInfoLog(sh) + '\n--- source ---\n' + src);
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }
  function link(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('Program link error: ' + gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  // Single quad
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

  const vs = compile(window.VS, gl.VERTEX_SHADER);

  // Compile a program, cache uniform locations.
  function buildProgram(fsSource) {
    const fs = compile(fsSource, gl.FRAGMENT_SHADER);
    if (!fs) return null;
    const program = link(vs, fs);
    if (!program) return null;
    const aPos = gl.getAttribLocation(program, 'a_position');
    const u = {
      res:      gl.getUniformLocation(program, 'u_res'),
      mouse:    gl.getUniformLocation(program, 'u_mouse'),
      mouseRaw: gl.getUniformLocation(program, 'u_mouseRaw'),
      time:     gl.getUniformLocation(program, 'u_time'),
      clicks:   gl.getUniformLocation(program, 'u_clicks'),
      pull:     gl.getUniformLocation(program, 'u_pull'),
      detail:   gl.getUniformLocation(program, 'u_detail'),
      palette:  gl.getUniformLocation(program, 'u_palette'),
      dpi:      gl.getUniformLocation(program, 'u_dpi'),
    };
    return { program, aPos, u };
  }

  const programs = window.SHADERS.map(s => Object.assign({}, s, buildProgram(s.fs)));

  // ─── state ───
  const state = {
    active: 0,
    mouse: [0.5, 0.5],
    mouseRaw: [0.5, 0.5],
    mouseTarget: [0.5, 0.5],
    timeStart: performance.now(),
    timeAcc: 0,
    lastFrame: performance.now(),
    speed: 1.0,
    pull: 0.6,
    detail: 1.0,
    palette: 0,
    clicks: [],   // {x,y, t0}
    clickCount: 0,
    fps: 60,
    fpsAccum: 0,
    fpsFrames: 0,
  };

  // ─── resize ───
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    state.dpr = dpr;
  }
  resize();
  window.addEventListener('resize', resize);

  // ─── input ───
  function onMove(e) {
    const x = e.clientX / window.innerWidth;
    const y = 1.0 - e.clientY / window.innerHeight; // y-up
    state.mouseTarget = [x, y];
    state.mouseRaw = [x, y];
    document.getElementById('rail-mouse').textContent =
      x.toFixed(2) + ', ' + y.toFixed(2);
  }
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) onMove(e.touches[0]);
  }, { passive: true });

  function pushClick(clientX, clientY) {
    const x = clientX / window.innerWidth;
    const y = 1.0 - clientY / window.innerHeight;
    state.clicks.push({ x, y, t0: performance.now() });
    if (state.clicks.length > 8) state.clicks.shift();
    state.clickCount++;
    document.getElementById('rail-clicks').textContent = state.clickCount.toString().padStart(3, '0');

    // Visual ripple
    const r = document.createElement('div');
    r.className = 'ripple';
    r.style.left = clientX + 'px';
    r.style.top = clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 900);
  }

  document.getElementById('stage').addEventListener('mousedown', (e) => {
    pushClick(e.clientX, e.clientY);
  });
  document.getElementById('stage').addEventListener('touchstart', (e) => {
    if (e.touches[0]) pushClick(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  // Keys 1-5 switch shader
  window.addEventListener('keydown', (e) => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= programs.length) {
      setActive(n - 1);
    } else if (e.key === 't' || e.key === 'T') {
      document.getElementById('tweaks').classList.toggle('show');
    }
  });

  // ─── dock ───
  const dock = document.getElementById('dock');
  programs.forEach((p, i) => {
    const item = document.createElement('button');
    item.className = 'dock-item';
    item.dataset.idx = i;
    item.innerHTML = `<canvas></canvas><span class="num">0${i+1}</span><span class="tip">${p.name}</span>`;
    const c = item.querySelector('canvas');
    c.width = 128; c.height = 128;
    paintSwatch(c, p.swatch);
    item.addEventListener('click', () => setActive(i));
    dock.appendChild(item);
  });

  function paintSwatch(canvas, colors) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[2]);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
    // soft glow blob
    const g2 = ctx.createRadialGradient(w*0.35, h*0.35, 0, w*0.35, h*0.35, w*0.7);
    g2.addColorStop(0, colors[2] + 'aa');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);
  }

  function setActive(i) {
    state.active = i;
    const s = programs[i];
    document.getElementById('np-idx').textContent = `0${i+1} / 0${programs.length}`;
    document.getElementById('np-name').textContent = s.name;
    document.getElementById('hud-title').textContent = s.name;
    document.getElementById('hud-desc').textContent = s.desc;
    [...dock.children].forEach((el, idx) => el.classList.toggle('active', idx === i));
  }
  setActive(0);

  // ─── tweaks ───
  document.getElementById('toggleTweaks').addEventListener('click', () => {
    document.getElementById('tweaks').classList.toggle('show');
  });
  function bindRange(id, lblId, fmt, key, scale = 1) {
    const el = document.getElementById(id);
    const lbl = document.getElementById(lblId);
    el.addEventListener('input', () => {
      state[key] = parseFloat(el.value) * scale;
      lbl.textContent = fmt(state[key]);
    });
  }
  bindRange('speed', 'lbl-speed', v => v.toFixed(2) + '×', 'speed', 0.01);
  bindRange('pull', 'lbl-pull', v => v.toFixed(2), 'pull', 0.01);
  bindRange('detail', 'lbl-detail', v => v.toFixed(2) + '×', 'detail', 0.01);

  document.querySelectorAll('#palettes .swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('#palettes .swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      state.palette = parseInt(sw.dataset.pal, 10);
    });
  });

  // ─── clock ───
  function tickClock() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hh}:${mm}`;
  }
  tickClock();
  setInterval(tickClock, 30 * 1000);

  // ─── render loop ───
  gl.clearColor(0.06, 0.17, 0.12, 1.0);
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);

  let lastT = performance.now();
  function frame(now) {
    const dt = Math.min((now - lastT) / 1000, 0.1);
    lastT = now;

    // smooth mouse
    const lerp = 1 - Math.pow(0.001, dt);
    state.mouse[0] += (state.mouseTarget[0] - state.mouse[0]) * lerp;
    state.mouse[1] += (state.mouseTarget[1] - state.mouse[1]) * lerp;

    // accumulate scaled time
    state.timeAcc += dt * state.speed;

    // expire clicks
    state.clicks = state.clicks.filter(c => (now - c.t0) / 1000 < 3.0);

    // FPS
    state.fpsAccum += dt; state.fpsFrames++;
    if (state.fpsAccum >= 0.5) {
      state.fps = Math.round(state.fpsFrames / state.fpsAccum);
      state.fpsAccum = 0; state.fpsFrames = 0;
      document.getElementById('fps').textContent = state.fps;
      document.getElementById('rail-time').textContent = state.timeAcc.toFixed(1) + 's';
    }

    // render active program
    const prog = programs[state.active];
    if (prog && prog.program) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(prog.program);
      gl.enableVertexAttribArray(prog.aPos);
      gl.vertexAttribPointer(prog.aPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(prog.u.res, canvas.width, canvas.height);
      gl.uniform2f(prog.u.mouse, state.mouse[0], state.mouse[1]);
      gl.uniform2f(prog.u.mouseRaw, state.mouseRaw[0], state.mouseRaw[1]);
      gl.uniform1f(prog.u.time, state.timeAcc);
      gl.uniform1f(prog.u.pull, state.pull);
      gl.uniform1f(prog.u.detail, state.detail);
      gl.uniform1i(prog.u.palette, state.palette);
      gl.uniform1f(prog.u.dpi, state.dpr || 1);

      // pack clicks into vec4[8]: x, y, age, _
      const buf = new Float32Array(8 * 4).fill(0);
      for (let i = 0; i < 8; i++) buf[i*4 + 2] = -1; // age sentinel
      for (let i = 0; i < state.clicks.length && i < 8; i++) {
        const c = state.clicks[i];
        buf[i*4 + 0] = c.x;
        buf[i*4 + 1] = c.y;
        buf[i*4 + 2] = (now - c.t0) / 1000;
        buf[i*4 + 3] = 0;
      }
      gl.uniform4fv(prog.u.clicks, buf);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
