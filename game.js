/* =====================================================================
   ClueDusk — game.js
   Lived-in house + fenced yard: 3D world, collisions, touch controls,
   1P/3P camera, flashlight, scares, clues, verdict and endings.
   Bridges: window.ClueDusk (menu.js) and window.ClueDuskStory (story.js).
   Events in: cluedusk:start | leave | pause | resume | verdict | hint
   ===================================================================== */
(function () {
  'use strict';

  const CD = window.ClueDusk;
  const ST = window.ClueDuskStory;
  if (!CD || !ST || typeof THREE === 'undefined') {
    console.error('ClueDusk: game.js needs menu.js, story.js and three.js');
    return;
  }

  /* ----------------------------- CONFIG ----------------------------- */
  const CFG = {
    radius: 0.3,
    eye: 1.62,
    walk: 2.3,
    sprint: 4.2,
    gravity: 15,
    jumpV: 5.4,
    stamina: { drain: 30, regen: 18, min: 22 },
    battery: { drain: 0.9, charge: 3 },
    look: { x: 0.0046, y: 0.0036, pitchMin: -1.2, pitchMax: 0.95 },
    joy: { radius: 56, dead: 0.12 },
    camDist: 3.2,
    interact: 2.1,
    freeHints: 5,
    diff: {
      easy:   { batt: 0.55, scare: 0.18, mult: 1,   ambient: [34, 52] },
      normal: { batt: 1.0,  scare: 0.4,  mult: 1.5, ambient: [24, 40] },
      hard:   { batt: 1.5,  scare: 0.75, mult: 2,   ambient: [16, 28] }
    },
    rewards: { exposed: 300, shadow: 150, cover: 40 }
  };

  /* Appearance of equipped items (mirrors the shop catalogue colours) */
  const LOOK = {
    o_hoodie:    { top: 0x3b4456, bottom: 0x161c2b },
    o_tee_cargo: { top: 0xe2e8f0, bottom: 0x56624a },
    o_bomber:    { top: 0x9f1d1d, bottom: 0x1f2937, sleeves: 0xf8fafc },
    o_techwear:  { top: 0x0b0f19, bottom: 0x0b0f19, trim: 0x38bdf8 },
    o_velvet:    { top: 0x3b0764, bottom: 0x1e1036, trim: 0xfbbf24 },
    o_phantom:   { top: 0x7f1d1d, bottom: 0x111018, trim: 0xf43f5e, long: true }
  };
  const HAT = {
    h_beanie:  { type: 'beanie',  color: 0x3b82f6 },
    h_fedora:  { type: 'fedora',  color: 0x3f2e22 },
    h_shark:   { type: 'shark',   color: 0x64748b },
    h_pikachu: { type: 'pikachu', color: 0xfacc15 },
    h_halo:    { type: 'halo',    color: 0xf43f5e }
  };
  const ACC = { a_scarf: { color: 0xb91c1c } };

  const TX = {
    ru: {
      skip: 'Пропустить', next: 'Далее', begin: 'Начать', lobby: 'В лобби', reward: 'Награда',
      battery: 'Фонарь', stamina: 'Бег', clue: 'Осмотреть', open: 'Открыть дверь', close: 'Закрыть дверь',
      freeLeft: 'Бесплатных подсказок осталось', freeNone: 'Бесплатные подсказки закончились',
      hintTag: 'Подсказка', first: '1Л', third: '3Л', dead: 'Фонарь разряжен',
      tired: 'Слишком устали, чтобы бежать', egg: 'Скрытый артефакт', caseNote: 'Дело',
      tierLabel: 'Финал', uv: 'UV-режим: видны скрытые улики', unit: 'DuskCoins'
    },
    en: {
      skip: 'Skip', next: 'Next', begin: 'Begin', lobby: 'To lobby', reward: 'Reward',
      battery: 'Flashlight', stamina: 'Sprint', clue: 'Inspect', open: 'Open door', close: 'Close door',
      freeLeft: 'Free hints left', freeNone: 'No free hints left',
      hintTag: 'Hint', first: '1P', third: '3P', dead: 'Flashlight is dead',
      tired: 'Too tired to sprint', egg: 'Hidden artifact', caseNote: 'Case',
      tierLabel: 'Ending', uv: 'UV mode: hidden clues visible', unit: 'DuskCoins'
    }
  };

  /* Clue and Easter egg positions. kind -> size/material in KIND. */
  const KIND = {
    floor:  { s: [0.34, 0.02, 0.34], m: 'clueGlow', flat: true },
    paperX: { s: [0.03, 0.2, 0.26],  m: 'paper',    flat: false },
    paperZ: { s: [0.26, 0.2, 0.03],  m: 'paper',    flat: false },
    key:    { s: [0.14, 0.03, 0.06], m: 'metal',    flat: true },
    jacket: { s: [0.46, 0.6, 0.1],   m: 'cloth2',   flat: false },
    screen: { s: [0.05, 0.26, 0.34], m: 'screen',   flat: false },
    egg:    { s: [0.24, 0.02, 0.18], m: 'paper',    flat: true }
  };
  const SPOTS = [
    { id: 'c_footprints', type: 'clue', kind: 'floor',  x: 0.2,   y: 0.01, z: -2.6 },
    { id: 'c_iou',        type: 'clue', kind: 'paperX', x: -6.22, y: 1.2,  z: -8.0 },
    { id: 'c_key',        type: 'clue', kind: 'key',    x: 8.0,   y: 0.96, z: -11.9 },
    { id: 'c_fridge',     type: 'clue', kind: 'paperZ', x: 6.3,   y: 1.35, z: -7.93 },
    { id: 'c_jacket',     type: 'clue', kind: 'jacket', x: 0.7,   y: 1.25, z: -7.3 },
    { id: 'c_butt',       type: 'clue', kind: 'floor',  x: -10.2, y: 0.01, z: -6.2 },
    { id: 'c_camera',     type: 'clue', kind: 'screen', x: -6.4,  y: 1.0,  z: -5.5 },
    { id: ST.egg.id,      type: 'egg',  kind: 'egg',    x: 5.2,   y: 0.02, z: -3.3 }
  ];
  const FIG_SPOTS = [[0, -8.3], [-6, -2.4], [5, -8.2], [5.2, -1.6], [0.3, -1.5], [-9.5, -3], [9.6, -7], [-2.5, -6.2]];
  const BUSHES = [[-8.5, 2], [8.6, 1.5], [-9.5, -4], [9.7, -3], [-8, -12], [3, -13], [-3, -13.2], [9.2, 5], [-6.5, 6.5], [6.8, 6]];

  /* ----------------------------- STATE ------------------------------ */
  const G = {
    built: false, active: false, paused: false, locked: true, ended: false, TOUCH: false,
    renderer: null, canvas: null, scene: null, cam: null, DOWN: null, tmpDir: null,
    raf: 0, last: 0, t: 0, startAt: 0,
    M: null, colliders: [], doors: [], items: [], lamps: [], body: null, fig: null,
    spot: null, flashBeam: null, dust: null,
    yaw: 0, pitch: -0.05, px: 0, py: 0, pz: 2.5, vy: 0, grounded: true,
    stamina: 100, battery: 100, flashOn: false, flashMode: 0, sprint: false, third: false,
    jumpReq: false, moving: false, speed: 0, stepDist: 0, bobT: 0,
    nextAmbient: 30, flick: 0, diff: 'normal',
    target: null, promptKey: '', clues: new Set(), egg: false, freeUsed: 0,
    keys: {}, intro: null, typeTimer: 0, typeNode: null, typeFull: '', stampTimer: 0, subTimer: 0,
    ui: { fx: null, ending: null }
  };
  const JOY = { id: null, ox: 0, oy: 0, x: 0, y: 0 };
  const LK = { id: null, x: 0, y: 0 };
  let joyEl = null;
  let knobEl = null;

  /* ----------------------------- HELPERS ---------------------------- */
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const lang = () => (CD.state && CD.state.lang) || 'ru';
  const L = (o) => (o && (o[lang()] || o.en || o.ru)) || '';
  const tx = (k) => (TX[lang()] && TX[lang()][k]) || TX.en[k] || k;
  const el = (tag, css, text) => {
    const n = document.createElement(tag);
    if (css) n.style.cssText = css;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const cls = (tag, className, text) => {
    const n = document.createElement(tag);
    n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const setBtn = (id, on) => { const n = $(id); if (n) n.classList.toggle('on', !!on); };
  const isUi = (t) => !!(t && t.closest && t.closest('button, .modal, .overlay, .dialogue, input'));

  /* ----------------------------- AUDIO ------------------------------ */
  const AU = { ctx: null, master: null, noise: null };

  function audioInit() {
    if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = new AC();
    AU.ctx = c;
    AU.master = c.createGain();
    AU.master.gain.value = 0;
    AU.master.connect(c.destination);
    const len = c.sampleRate * 2;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    AU.noise = buf;

    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180;
    const g = c.createGain(); g.gain.value = 0.05;
    const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 41;
    const o2 = c.createOscillator(); o2.type = 'triangle'; o2.frequency.value = 43.5;
    const lfo = c.createOscillator(); lfo.frequency.value = 0.07;
    const lg = c.createGain(); lg.gain.value = 0.025;
    lfo.connect(lg); lg.connect(g.gain);
    o1.connect(g); o2.connect(g); g.connect(lp); lp.connect(AU.master);
    o1.start(); o2.start(); lfo.start();
  }

  function soundOn() { return !!(AU.ctx && AU.master && CD.state.sound); }

  function audioOn(on) {
    if (!AU.ctx || !AU.master) return;
    AU.master.gain.setTargetAtTime(on && CD.state.sound ? 0.85 : 0, AU.ctx.currentTime, 0.25);
  }

  function tone(f, dur, type, vol, when, toF) {
    if (!soundOn()) return;
    const c = AU.ctx;
    const t0 = c.currentTime + (when || 0);
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t0);
    if (toF) o.frequency.exponentialRampToValueAtTime(toF, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(AU.master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  function noiseBurst(dur, type, f, q, vol, when, toF) {
    if (!soundOn()) return;
    const c = AU.ctx;
    const t0 = c.currentTime + (when || 0);
    const s = c.createBufferSource();
    s.buffer = AU.noise;
    const flt = c.createBiquadFilter();
    flt.type = type;
    flt.frequency.setValueAtTime(f, t0);
    flt.Q.value = q || 1;
    if (toF) flt.frequency.exponentialRampToValueAtTime(toF, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(flt); flt.connect(g); g.connect(AU.master);
    s.start(t0, Math.random() * 1.5);
    s.stop(t0 + dur + 0.05);
  }

  const sfxChime = () => { tone(784, 0.35, 'sine', 0.05); tone(1174, 0.5, 'sine', 0.035, 0.08); };
  const sfxBang = () => { noiseBurst(0.35, 'lowpass', 260, 1, 0.9); tone(70, 0.45, 'sine', 0.25, 0, 40); };
  const sfxSting = () => {
    tone(110, 1.8, 'sawtooth', 0.035);
    tone(117, 1.8, 'sawtooth', 0.03);
    tone(1760, 0.25, 'sine', 0.02, 0.2);
    tone(1480, 0.4, 'triangle', 0.02, 0.5);
  };
  const sfxWhisper = () => noiseBurst(1.6, 'bandpass', 900, 2, 0.05, 0, 2400);
  const sfxStep = (when) => { noiseBurst(0.08, 'lowpass', 500, 1, 0.12, when || 0); tone(90, 0.06, 'sine', 0.05, when || 0); };
  const sfxCreak = () => tone(90, 1.3, 'sawtooth', 0.03, 0, 170);

  /* ----------------------------- MATERIALS -------------------------- */
  function mat(c, r, m, e, ei) {
    return new THREE.MeshStandardMaterial({
      color: c,
      roughness: r === undefined ? 0.8 : r,
      metalness: m || 0,
      emissive: e || 0,
      emissiveIntensity: ei === undefined ? 1 : ei
    });
  }

  function addMesh(parent, geo, m, x, y, z) {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x || 0, y || 0, z || 0);
    parent.add(mesh);
    return mesh;
  }

  function box(parent, w, h, d, x, y, z, m) {
    return addMesh(parent, new THREE.BoxGeometry(w, h, d), m, x, y, z);
  }

  function addCol(x0, x1, z0, z1) {
    const c = { minX: x0, maxX: x1, minZ: z0, maxZ: z1, on: true };
    G.colliders.push(c);
    return c;
  }

  function wall(x0, x1, z0, z1, h, m) {
    const height = h || 2.6;
    box(G.scene, x1 - x0, height, z1 - z0, (x0 + x1) / 2, height / 2, (z0 + z1) / 2, m || G.M.wall);
    addCol(x0, x1, z0, z1);
  }

  function solid(x, z, w, d, h, m) {
    box(G.scene, w, h, d, x, h / 2, z, m);
    addCol(x - w / 2, x + w / 2, z - d / 2, z + d / 2);
  }

  function beam(apex, dir, len, radius, color, opacity) {
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(radius, len, 24, 1, true),
      new THREE.MeshBasicMaterial({
        color: color, transparent: true, opacity: opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
      })
    );
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
    m.position.copy(apex).addScaledVector(dir, len / 2);
    G.scene.add(m);
    return m;
  }

  /* ----------------------------- WORLD ------------------------------ */
  function lamp(x, y, z, k) {
    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.36, 0.22, 16, 1, true), G.M.shade
    );
    shade.position.set(x, y, z);
    G.scene.add(shade);
    const light = new THREE.PointLight(0xffb36b, k, 9, 1.6);
    light.position.set(x, y - 0.1, z);
    G.scene.add(light);
    beam(new THREE.Vector3(x, y - 0.15, z), new THREE.Vector3(0, -1, 0), 2.2, 0.95, 0xffb36b, 0.05);
    G.lamps.push({ light: light, base: k });
  }

  function makeDoor(id, wallX, hingeZ, openAngle) {
    const pivot = new THREE.Group();
    pivot.position.set(wallX, 0, hingeZ);
    G.scene.add(pivot);
    box(pivot, 0.07, 2.3, 2.0, 0, 1.15, 1.0, G.M.wood);
    const col = { minX: wallX - 0.12, maxX: wallX + 0.12, minZ: hingeZ, maxZ: hingeZ + 2, on: true };
    G.colliders.push(col);
    const door = { id: id, pivot: pivot, col: col, open: false, angle: 0, openAngle: openAngle, slam: false };
    G.doors.push(door);
    G.items.push({ id: id, type: 'door', door: door, x: wallX, z: hingeZ + 1, collected: false, group: null, ring: null, phase: 0 });
  }

  function buildWorld() {
    const S = G.scene;
    G.M = {
      wall: mat(0x3b3229, 0.95),
      wood: mat(0x4a3423, 0.7),
      yard: mat(0x0c1613, 1),
      fence: mat(0x231c15, 0.95),
      sofa: mat(0x2f4f4f, 0.95),
      cloth: mat(0x6b4a33, 0.9),
      table: mat(0x5a3f2a, 0.6),
      fridge: mat(0xc9d1d9, 0.4, 0.2),
      bed: mat(0x7a2e3a, 0.95),
      wardrobe: mat(0x4a3626, 0.7),
      shelf: mat(0x3e2c1f, 0.7),
      plant: mat(0x2f6b3a, 0.9),
      pot: mat(0x6b3d2a, 0.9),
      metal: mat(0x59606b, 0.5, 0.6),
      paper: mat(0xe9e0c9, 0.9, 0, 0x6b5f45, 0.2),
      clueGlow: mat(0x5a2a18, 0.6, 0, 0xff8a4a, 0.25),
      cloth2: mat(0x2b3442, 0.9),
      screen: mat(0x0b2a3a, 0.4, 0, 0x2a7fbf, 0.9),
      dark: mat
