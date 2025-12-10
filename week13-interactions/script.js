import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// -----------------------------
// Three.js — Random Cubes with Raycasting + UI Panel
// Single-file JS module (drop into an ES module enabled page / bundler)
// -----------------------------

// Renderer + DOM
const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
renderer.setPixelRatio(window.devicePixelRatio || 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene + Camera + Controls
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f14);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 3.5, 12);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemi.position.set(0, 50, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.9);
dir.position.set(5, 10, 7.5);
scene.add(dir);

// Helpful grid
const grid = new THREE.GridHelper(40, 40, 0x222233, 0x121218);
grid.position.y = -4.5;
scene.add(grid);

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// UI Panel (injected via JS)
const panel = document.createElement('div');
Object.assign(panel.style, {
  position: 'absolute',
  right: '18px',
  top: '18px',
  minWidth: '240px',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.96)',
  color: '#111',
  borderRadius: '10px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
  fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
  fontSize: '13px',
  zIndex: '1000',
});
panel.innerHTML = `<div style="font-weight:700;margin-bottom:8px">Cube inspector</div>
<div id="panel-message">Click a cube to see its information here.</div>
<div id="panel-data" style="display:none;margin-top:8px">
  <div style="margin-bottom:6px"><strong>Position</strong>: <span id="p-pos"></span></div>
  <div><strong>Size</strong>: <span id="p-size"></span></div>
</div>`;
document.body.appendChild(panel);

const panelMessage = panel.querySelector('#panel-message');
const panelData = panel.querySelector('#panel-data');
const panelPos = panel.querySelector('#p-pos');
const panelSize = panel.querySelector('#p-size');

// Cubes storage
const cubes = [];
let selected = null;

// Create N cubes (N >= 20)
const N = 30;
for (let i = 0; i < N; i++) {
  const w = randBetween(0.4, 1.8);
  const h = randBetween(0.4, 1.8);
  const d = randBetween(0.4, 1.8);
  const geom = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color: getRandomColor(), roughness: 0.5, metalness: 0.05 });
  const m = new THREE.Mesh(geom, mat);

  // store values
  m.userData.size = { w: Number(w.toFixed(3)), h: Number(h.toFixed(3)), d: Number(d.toFixed(3)) };
  m.userData.originalColor = mat.color.getHex();
  m.userData.baseScale = randBetween(0.85, 1.05);
  m.userData.targetScale = m.userData.baseScale;

  // random transform
  m.position.set(randBetween(-8, 8), randBetween(-3, 3), randBetween(-10, 4));
  m.rotation.set(randBetween(0, Math.PI), randBetween(0, Math.PI), randBetween(0, Math.PI));
  m.scale.set(m.userData.baseScale, m.userData.baseScale, m.userData.baseScale);

  scene.add(m);
  cubes.push(m);
}

// Pointer handling
renderer.domElement.addEventListener('pointerdown', onPointerDown);
window.addEventListener('resize', onResize);

function onPointerDown(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(cubes, false);

  if (intersects.length > 0) {
    const picked = intersects[0].object;
    selectObject(picked);
  } else {
    deselect();
  }
}

function selectObject(obj) {
  if (selected && selected !== obj) {
    // revert previous
    selected.material.color.setHex(selected.userData.originalColor);
    selected.userData.targetScale = selected.userData.baseScale;
  }

  selected = obj;

  // highlight: blend toward a bright tint and increase scale target
  const highlight = new THREE.Color(0xffff88);
  selected.material.color.lerp(highlight, 0.7);
  selected.userData.targetScale = selected.userData.baseScale * 1.25;

  // Update UI panel
  const p = selected.position;
  panelPos.textContent = `x: ${p.x.toFixed(3)}, y: ${p.y.toFixed(3)}, z: ${p.z.toFixed(3)}`;
  const s = selected.userData.size;
  panelSize.textContent = `${s.w} × ${s.h} × ${s.d}`;

  panelMessage.style.display = 'none';
  panelData.style.display = 'block';
}

function deselect() {
  if (selected) {
    selected.material.color.setHex(selected.userData.originalColor);
    selected.userData.targetScale = selected.userData.baseScale;
    selected = null;
  }

  panelMessage.style.display = 'block';
  panelMessage.textContent = 'No object selected.';
  panelData.style.display = 'none';
}

// Animation loop (renders and also smooth-scaling + pulse)
function animate(time) {
  requestAnimationFrame(animate);

  // smooth scale lerp and small pulsing for selected
  for (const c of cubes) {
    const cur = c.scale.x;
    const target = c.userData.targetScale;
    const next = THREE.MathUtils.lerp(cur, target, 0.12);
    if (c === selected) {
      const pulse = 1 + Math.sin(time * 0.006) * 0.03; // subtle pulse
      c.scale.set(next * pulse, next * pulse, next * pulse);
    } else {
      c.scale.set(next, next, next);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Helpers
function randBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomColor() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}
