"use client";

import { useRef, useEffect } from "react";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "@/lib/shaders";

interface ShaderBackgroundProps {
  className?: string;
}

function compileShader(gl: WebGL2RenderingContext, src: string, type: number): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function linkProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

export default function ShaderBackground({ className = "" }: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    mouse: [0.5, 0.5],
    mouseTarget: [0.5, 0.5],
    mouseRaw: [0.5, 0.5],
    timeAcc: 0,
    pull: 0.6,
    detail: 1.0,
    clicks: [] as { x: number; y: number; t0: number }[],
    clickCount: 0,
    isVisible: true,
    reducedMotion: false,
    dpr: 1,
    lastT: 0,
    rafId: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    stateRef.current.reducedMotion = mq.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      stateRef.current.reducedMotion = e.matches;
    };
    mq.addEventListener("change", handleMotionChange);

    // Initialize WebGL2
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
      alpha: false,
    });

    if (!gl) {
      canvas.style.background =
        "linear-gradient(135deg, #0F2B1E 0%, #143326 40%, #1a4a35 70%, #0F2B1E 100%)";
      return () => {
        mq.removeEventListener("change", handleMotionChange);
      };
    }

    const vs = compileShader(gl, VERTEX_SHADER, gl.VERTEX_SHADER);
    const fs = compileShader(gl, FRAGMENT_SHADER, gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      canvas.style.background =
        "linear-gradient(135deg, #0F2B1E 0%, #143326 40%, #1a4a35 70%, #0F2B1E 100%)";
      return () => {
        mq.removeEventListener("change", handleMotionChange);
      };
    }

    const program = linkProgram(gl, vs, fs);
    if (!program) {
      canvas.style.background =
        "linear-gradient(135deg, #0F2B1E 0%, #143326 40%, #1a4a35 70%, #0F2B1E 100%)";
      return () => {
        mq.removeEventListener("change", handleMotionChange);
      };
    }

    // Create full-screen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, "a_position");
    const uniforms = {
      res: gl.getUniformLocation(program, "u_res"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      time: gl.getUniformLocation(program, "u_time"),
      clicks: gl.getUniformLocation(program, "u_clicks"),
      pull: gl.getUniformLocation(program, "u_pull"),
      detail: gl.getUniformLocation(program, "u_detail"),
      dpi: gl.getUniformLocation(program, "u_dpi"),
    };

    const state = stateRef.current;

    // Resize handler
    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      state.dpr = dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Mouse handler — attach to window so it works even when content overlays the canvas
    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Only track when mouse is within or near the hero section
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      state.mouseTarget = [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
      state.mouseRaw = [Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y))];
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", (e) => {
      if (e.touches[0]) onMove(e.touches[0] as unknown as MouseEvent);
    }, { passive: true });

    // Click handler — attach to window for hero-wide click detection
    function onClick(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Only register clicks within the canvas bounds
      if (e.clientY > rect.bottom) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      state.clicks.push({ x, y, t0: performance.now() });
      if (state.clicks.length > 8) state.clicks.shift();
      state.clickCount++;

      // Visual ripple DOM element
      const ripple = document.createElement("div");
      ripple.className = "shader-ripple";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 900);
    }
    window.addEventListener("mousedown", onClick);
    window.addEventListener("touchstart", (e) => {
      if (e.touches[0]) onClick(e.touches[0] as unknown as MouseEvent);
    }, { passive: true });

    // IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Render loop
    let lastT = performance.now();
    function frame(now: number) {
      const dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;

      if (state.isVisible && !state.reducedMotion && gl && canvas) {
        // Smooth mouse
        const lerp = 1 - Math.pow(0.001, dt);
        state.mouse[0] += (state.mouseTarget[0] - state.mouse[0]) * lerp;
        state.mouse[1] += (state.mouseTarget[1] - state.mouse[1]) * lerp;

        // Accumulate time
        state.timeAcc += dt;

        // Expire clicks
        state.clicks = state.clicks.filter((c) => (now - c.t0) / 1000 < 3.0);

        // Render
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(uniforms.res, canvas.width, canvas.height);
        gl.uniform2f(uniforms.mouse, state.mouse[0], state.mouse[1]);
        gl.uniform1f(uniforms.time, state.timeAcc);
        gl.uniform1f(uniforms.pull, state.pull);
        gl.uniform1f(uniforms.detail, state.detail);
        gl.uniform1f(uniforms.dpi, state.dpr);

        // Pack clicks
        const buf = new Float32Array(8 * 4).fill(0);
        for (let i = 0; i < 8; i++) buf[i * 4 + 2] = -1;
        for (let i = 0; i < state.clicks.length && i < 8; i++) {
          const c = state.clicks[i];
          buf[i * 4 + 0] = c.x;
          buf[i * 4 + 1] = c.y;
          buf[i * 4 + 2] = (now - c.t0) / 1000;
          buf[i * 4 + 3] = 0;
        }
        gl.uniform4fv(uniforms.clicks, buf);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      state.rafId = requestAnimationFrame(frame);
    }
    state.rafId = requestAnimationFrame(frame);

    return () => {
      mq.removeEventListener("change", handleMotionChange);
      cancelAnimationFrame(state.rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (quad) gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ touchAction: "none" }}
    />
  );
}
