// The live hive: a sphere of dark, glossy hexagonal tiles. Each batch of tokens lights one tile, anywhere on
// the sphere, for two seconds. Plain three.js with no React, so the page can load it on demand.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { DRAIN_SECONDS } from "@/lib/live-hive";
import type { NetVendor } from "@/lib/public-network";

export type Backdrop = "dust" | "orbits" | "floor" | "plain";
export type Palette = "duo" | "mono";
export type HiveScene = {
  /** Queue tiles for a vendor's tokens; they play out over the next minute or so. */
  add(vendor: NetVendor, tiles: number): void;
  setBackdrop(backdrop: Backdrop): void;
  setPalette(palette: Palette): void;
  setPlaying(playing: boolean): void;
  dispose(): void;
};

const PAGE = 0x0a0b0c;
const VOLT = 0xc8f031;
const PAPER = 0xf2f2ee;
const RADIUS = 9;
const LIT_SECONDS = 2;
/** Radians per second the sphere turns by itself. */
const SPIN = 0.07;
const VENDORS: NetVendor[] = ["anthropic", "openai"];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

function poisson(mean: number): number {
  let k = 0, p = Math.exp(-mean), sum = p;
  const u = Math.random();
  while (u > sum && k < 500) { k++; p *= mean / k; sum += p; }
  return k;
}

/**
 * Per-tile state: rgb is the colour of the token, a is how far through its two-second breath the tile is.
 * It lives in a float texture so the tile shader can read it.
 */
function makeTiles(n: number) {
  const W = 128, H = Math.ceil(n / W);
  const data = new Float32Array(W * H * 4);
  const born = new Float64Array(n).fill(-1e9);
  const texture = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.FloatType);
  texture.needsUpdate = true;
  return {
    n, texture, size: new THREE.Vector2(W, H),
    /** A tile that is dark right now, so a new token never cuts another one's breath short. */
    free(t: number): number {
      for (let i = 0; i < 8; i++) {
        const c = Math.floor(Math.random() * n);
        if (t - born[c] >= LIT_SECONDS) return c;
      }
      return -1;
    },
    light(c: number, rgb: THREE.Color, t: number) {
      const o = c * 4;
      data[o] = rgb.r; data[o + 1] = rgb.g; data[o + 2] = rgb.b;
      born[c] = t;
    },
    /** One breath per token: it swells for a second and sinks away for a second. */
    breathe(t: number) {
      for (let c = 0; c < n; c++) {
        const a = (t - born[c]) / LIT_SECONDS, s = a < 1 ? Math.sin(Math.PI * a) : 0;
        data[c * 4 + 3] = s * s;
      }
      texture.needsUpdate = true;
    },
  };
}
const STATE_PARS = "uniform sampler2D uState; uniform vec2 uStateSize; attribute float aCell; varying vec4 vS;";
const STATE_READ = "float stRow = floor((aCell + 0.5) / uStateSize.x); vS = texture2D(uState, (vec2(aCell - stRow * uStateSize.x, stRow) + 0.5) / uStateSize);";

/** Hexagons (and twelve pentagons) covering a sphere: the dual of a subdivided icosahedron. */
function sphereCells(radius: number, detail: number): THREE.Vector3[][] {
  let ico: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail);
  ico.deleteAttribute("normal");
  ico.deleteAttribute("uv");
  ico = mergeVertices(ico, 1e-5);
  const P = ico.attributes.position.array, I = ico.index!.array;
  const nV = P.length / 3, nF = I.length / 3;
  const FC = new Float32Array(nF * 3);
  const VF: number[][] = Array.from({ length: nV }, () => []);
  for (let f = 0; f < nF; f++) {
    const a = I[f * 3], b = I[f * 3 + 1], c = I[f * 3 + 2];
    const x = P[a * 3] + P[b * 3] + P[c * 3];
    const y = P[a * 3 + 1] + P[b * 3 + 1] + P[c * 3 + 1];
    const z = P[a * 3 + 2] + P[b * 3 + 2] + P[c * 3 + 2];
    const l = Math.hypot(x, y, z);
    FC[f * 3] = x / l; FC[f * 3 + 1] = y / l; FC[f * 3 + 2] = z / l;
    VF[a].push(f); VF[b].push(f); VF[c].push(f);
  }
  ico.dispose();
  const cells: THREE.Vector3[][] = [];
  const c = new THREE.Vector3(), u = new THREE.Vector3(), w = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0), t = new THREE.Vector3();
  for (let v = 0; v < nV; v++) {
    c.set(P[v * 3], P[v * 3 + 1], P[v * 3 + 2]);
    u.crossVectors(up, c);
    if (u.lengthSq() < 1e-8) u.set(1, 0, 0);
    u.normalize();
    w.crossVectors(c, u);
    const ring = VF[v].map((f) => {
      t.set(FC[f * 3], FC[f * 3 + 1], FC[f * 3 + 2]).sub(c);
      return { f, a: Math.atan2(t.dot(w), t.dot(u)) };
    }).sort((p, q) => p.a - q.a);
    cells.push(ring.map((r) => new THREE.Vector3(FC[r.f * 3], FC[r.f * 3 + 1], FC[r.f * 3 + 2]).multiplyScalar(radius)));
  }
  return cells;
}

/**
 * Solid tiles: a flat hexagon set a little inside its outline, with a bevel running down to the seam it
 * shares with its neighbours.
 */
function tileGeometry(cells: THREE.Vector3[][], inset: number, groove: number): THREE.BufferGeometry {
  let count = 0;
  for (const ring of cells) count += ring.length * 9;
  const P = new Float32Array(count * 3), C = new Float32Array(count);
  let o = 0;
  const put = (v: THREE.Vector3, id: number) => { P[o * 3] = v.x; P[o * 3 + 1] = v.y; P[o * 3 + 2] = v.z; C[o] = id; o++; };
  const six = () => Array.from({ length: 6 }, () => new THREE.Vector3());
  const T = six(), G = six(), mid = new THREE.Vector3();
  cells.forEach((O, id) => {
    const k = O.length;
    mid.set(0, 0, 0);
    for (const p of O) mid.add(p);
    mid.multiplyScalar(1 / k);
    for (let i = 0; i < k; i++) {
      T[i].copy(O[i]).sub(mid).multiplyScalar(inset).add(mid);
      G[i].copy(O[i]).multiplyScalar(1 - groove / O[i].length());
    }
    for (let i = 0; i < k; i++) {
      const j = (i + 1) % k;
      put(mid, id); put(T[i], id); put(T[j], id);
      put(T[i], id); put(G[i], id); put(G[j], id);
      put(T[i], id); put(G[j], id); put(T[j], id);
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(P, 3));
  g.setAttribute("aCell", new THREE.BufferAttribute(C, 1));
  return g;
}

/** Dust: sharp points far behind the ball, turning very slowly with it. */
function makeDust() {
  const N = 2600;
  const at = new Float32Array(N * 3), seed = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    const r = RADIUS * lerp(2.2, 7.5, Math.pow(Math.random(), 0.7));
    at.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3);
    seed.set([Math.random(), Math.random(), Math.random()], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(at, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3));
  const uniforms = { uTime: { value: 0 }, uPx: { value: 1 }, uBack: { value: RADIUS + 0.5 } };
  // Colours here and on the floor are written straight in output space: the shader does no conversion.
  const points = new THREE.Points(geometry, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `
      uniform float uTime; uniform float uPx; uniform float uBack; attribute vec3 aSeed; varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec4 centre = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.3 + aSeed.x * 1.7) * uPx;
        // Only dust beyond the back of the ball shows, so no speck can be taken for a lit tile.
        float behind = step(mv.z, centre.z - uBack);
        vA = behind * (0.2 + 0.5 * aSeed.z) * (0.75 + 0.25 * sin(uTime * (0.4 + aSeed.y) + aSeed.y * 40.0));
      }`,
    fragmentShader: `
      varying float vA;
      void main(){
        float a = 1.0 - smoothstep(0.3, 0.5, length(gl_PointCoord - 0.5));
        gl_FragColor = vec4(0.95, 0.95, 0.93, a * vA);
      }`,
  }));
  points.frustumCulled = false;
  return { points, uniforms };
}

/** Orbits: three hair-thin rings at different tilts, each carrying one small bead. */
function makeOrbits() {
  const group = new THREE.Group();
  const ring = new THREE.MeshBasicMaterial({ color: PAPER, transparent: true, opacity: 0.17 });
  const dot = new THREE.MeshBasicMaterial({ color: PAPER });
  const beads = [[1.26, 1.2, 0.35, 0.34], [1.5, 1.42, -0.55, -0.22], [1.8, 1.02, 0.95, 0.15]].map(([k, tiltX, tiltZ, speed]) => {
    const plane = new THREE.Group();
    plane.rotation.set(tiltX, 0, tiltZ);
    const arm = new THREE.Group();
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), dot);
    bead.position.x = RADIUS * k;
    arm.add(bead);
    plane.add(new THREE.Mesh(new THREE.TorusGeometry(RADIUS * k, 0.016, 6, 220), ring), arm);
    group.add(plane);
    return { arm, speed };
  });
  return { group, beads };
}

/** Floor: a honeycomb drawn on the ground under the ball, fading out with distance. */
function makeFloor() {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(280, 280), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uCell: { value: 3.2 }, uReach: { value: 72 } },
    vertexShader: "varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: `
      uniform float uCell; uniform float uReach; varying vec2 vP;
      // Distance to the nearest cell edge on a grid of pointy-top hexagons one unit across.
      float hexEdge(vec2 p){
        const vec2 s = vec2(1.0, 1.7320508);
        vec4 c = floor(vec4(p, p - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
        vec4 h = vec4(p - c.xy * s, p - (c.zw + 0.5) * s);
        vec2 q = abs(dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw);
        return 0.5 - max(dot(q, s * 0.5), q.x);
      }
      void main(){
        float e = hexEdge(vP / uCell) * uCell;
        float w = fwidth(e);
        float line = 1.0 - smoothstep(0.45 * w, 1.15 * w, e);
        // Gone well before the horizon, and gone wherever the cells get too small to draw cleanly.
        float fade = (1.0 - smoothstep(0.1 * uReach, uReach, length(vP))) * (1.0 - smoothstep(0.1, 0.35, w / uCell));
        gl_FragColor = vec4(0.95, 0.95, 0.93, line * fade * 0.3);
      }`,
  }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -RADIUS * 1.04;
  return mesh;
}

/** Throws when WebGL is unavailable. */
export function mountHive(
  canvas: HTMLCanvasElement,
  initial: { backdrop: Backdrop; palette: Palette; playing: boolean },
): HiveScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAGE);
  // A studio to reflect: this is what gives the dark tiles their sheen. It is never seen directly.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const studio = pmrem.fromScene(new RoomEnvironment(), 0.04);
  pmrem.dispose();
  scene.environment = studio.texture;
  scene.environmentIntensity = 0.8;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);

  const cells = sphereCells(RADIUS, 21);
  const state = makeTiles(cells.length);
  const uniforms = { uState: { value: state.texture }, uStateSize: { value: state.size } };
  const material = new THREE.MeshStandardMaterial({ color: 0x34373a, roughness: 0.44, metalness: 1, flatShading: true });
  // The stock material, plus one thing per tile: while lit it gives off its token's colour. Nothing moves.
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${STATE_PARS}`)
      .replace("#include <begin_vertex>", `#include <begin_vertex>\n${STATE_READ}`);
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec4 vS;")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        float lit = clamp(vS.a, 0.0, 1.0);
        diffuseColor.rgb *= 1.0 - 0.7 * lit;
        totalEmissiveRadiance += max(vS.rgb, 0.0) * lit;`);
  };
  const ball = new THREE.Mesh(tileGeometry(cells, 0.9, 0.09), material);
  ball.frustumCulled = false;
  const spin = new THREE.Group();
  spin.add(ball);
  const tilt = new THREE.Group();
  tilt.add(spin);
  // Everything rides on one anchor, so the backdrops stay centred on the ball wherever it sits on screen.
  const anchor = new THREE.Group();
  const dust = makeDust(), orbits = makeOrbits(), floor = makeFloor();
  anchor.add(tilt, dust.points, orbits.group, floor);
  scene.add(anchor);

  const hues: Record<NetVendor, THREE.Color> = { anthropic: new THREE.Color(VOLT), openai: new THREE.Color(PAPER) };
  const backlog: Record<NetVendor, number> = { anthropic: 0, openai: 0 };
  // Past this the sphere would be mostly lit; a busier network should raise tokens per tile instead.
  const backlogLimit = ((0.4 * state.n) / LIT_SECONDS) * DRAIN_SECONDS;
  const turn = { on: false, id: -1, x: 0, y: 0, at: 0, yaw: 0, pitch: 0, vyaw: 0, vpitch: 0 };
  let playing = initial.playing, time = 0, last = 0, frame = 0, visible = true, ballPx = 300;
  const fit = { x: 0, y: 0 };

  const setBackdrop = (name: Backdrop) => {
    dust.points.visible = name === "dust";
    orbits.group.visible = name === "orbits";
    floor.visible = name === "floor";
  };
  const setPalette = (name: Palette) => {
    hues.openai.set(name === "mono" ? VOLT : PAPER);
  };
  setBackdrop(initial.backdrop);
  setPalette(initial.palette);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const px = clamp(Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4.2e6 / (w * h))), 0.75, 2);
    renderer.setPixelRatio(px);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const wide = camera.aspect > 1.15, half = RADIUS * 1.08;
    const dist = Math.max(half / (0.8 * tanH), half / ((wide ? 0.62 : 0.88) * tanH * camera.aspect));
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    // Beside the usage panel on a wide screen, below it on a narrow one.
    fit.x = wide ? dist * tanH * camera.aspect * 0.2 : 0;
    fit.y = wide ? 0 : -dist * tanH * 0.18;
    anchor.position.set(fit.x, fit.y, 0);
    ballPx = (RADIUS / (dist * tanH)) * (h / 2);
    dust.uniforms.uPx.value = px;
  }

  function tick(now: number) {
    frame = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    const run = playing ? dt : 0;
    time += run;
    if (!turn.on) {
      // Let go and it coasts, then settles back into its own slow turn.
      turn.yaw += turn.vyaw * dt + SPIN * run;
      turn.pitch += turn.vpitch * dt;
      turn.vyaw *= Math.exp(-dt * 2.2);
      turn.vpitch *= Math.exp(-dt * 4);
    }
    turn.pitch = clamp(turn.pitch, -1.5, 1.0);
    if (run > 0) {
      // The backlog drains a little every frame, so a burst of traffic swells and fades instead of flashing.
      for (const vendor of VENDORS) {
        const lit = Math.min(Math.floor(backlog[vendor]), poisson((backlog[vendor] * run) / DRAIN_SECONDS));
        for (let i = 0; i < lit; i++) {
          const c = state.free(time);
          if (c >= 0) state.light(c, hues[vendor], time);
        }
        backlog[vendor] -= lit;
      }
      state.breathe(time);
    }
    tilt.rotation.set(0.28 + turn.pitch, 0, 0.2);
    spin.rotation.y = turn.yaw;
    dust.uniforms.uTime.value = time;
    dust.points.rotation.set(turn.pitch * 0.06, turn.yaw * 0.05, 0);
    orbits.group.rotation.set(turn.pitch * 0.4, time * 0.03, 0);
    for (const b of orbits.beads) b.arm.rotation.z = time * b.speed;
    renderer.render(scene, camera);
  }
  const start = () => { if (!frame && visible && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); } };
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };

  // Drag to turn: the surface follows the pointer. On touch, a vertical swipe still scrolls the page.
  const down = (ev: PointerEvent) => {
    Object.assign(turn, { on: true, id: ev.pointerId, x: ev.clientX, y: ev.clientY, at: performance.now(), vyaw: 0, vpitch: 0 });
    try { canvas.setPointerCapture(ev.pointerId); } catch { /* capture is a nicety */ }
    canvas.dataset.dragging = "true";
  };
  const move = (ev: PointerEvent) => {
    if (!turn.on || ev.pointerId !== turn.id) return;
    const now = performance.now(), secs = Math.max(0.004, (now - turn.at) / 1000);
    const dyaw = (ev.clientX - turn.x) / ballPx, dpitch = (ev.clientY - turn.y) / ballPx;
    turn.yaw += dyaw;
    turn.pitch += dpitch;
    turn.vyaw = lerp(turn.vyaw, dyaw / secs, 0.5);
    turn.vpitch = lerp(turn.vpitch, dpitch / secs, 0.5);
    Object.assign(turn, { x: ev.clientX, y: ev.clientY, at: now });
  };
  const up = (ev: PointerEvent) => {
    if (!turn.on || ev.pointerId !== turn.id) return;
    turn.on = false;
    if (performance.now() - turn.at > 120) turn.vyaw = turn.vpitch = 0; // held still before letting go
    turn.vyaw = clamp(turn.vyaw, -6, 6);
    turn.vpitch = clamp(turn.vpitch, -6, 6);
    delete canvas.dataset.dragging;
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  // Draw only while the hive is on screen and the tab is in front.
  const sized = new ResizeObserver(resize);
  sized.observe(canvas);
  const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else stop(); });
  seen.observe(canvas);
  const shown = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", shown);

  resize();
  start();

  return {
    add(vendor, count) {
      if (count > 0) backlog[vendor] = Math.min(backlogLimit, backlog[vendor] + count);
    },
    setBackdrop,
    setPalette,
    setPlaying(on) { playing = on; },
    dispose() {
      stop();
      sized.disconnect();
      seen.disconnect();
      document.removeEventListener("visibilitychange", shown);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      scene.traverse((object) => {
        const item = object as THREE.Mesh;
        item.geometry?.dispose();
        for (const m of [item.material].flat()) m?.dispose();
      });
      state.texture.dispose();
      studio.dispose();
      renderer.dispose();
    },
  };
}
