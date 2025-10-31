// import stuff from Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// === Scene & Camera ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5); // light blue sky

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-24, 15, -4); // more diagonal, elevated view
camera.lookAt(11.5, 5, 9);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// === Lights ===
// soft ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);

scene.add(ambientLight);

// main sunlight with shadows
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 25, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.camera.left = -30;
dirLight.shadow.camera.right = 30;
dirLight.shadow.camera.top = 30;
dirLight.shadow.camera.bottom = -30;
scene.add(dirLight);

// sky/ground light for nicer colors
const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x444444, 0.4);
scene.add(hemiLight);

// small light for the plaza area
const plazaLight = new THREE.PointLight(0xfff7d8, 0.6, 20);
plazaLight.position.set(0, 6, 0);
scene.add(plazaLight);



// === Ground ===
const grassMat = new THREE.MeshLambertMaterial({ color: 0x5aa151 });
const grass = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), grassMat);
grass.rotation.x = -Math.PI / 2;
grass.receiveShadow = true;
scene.add(grass);

// small plaza circle in the center
const plazaMat = new THREE.MeshStandardMaterial({ color: 0xefe6d6, roughness: 0.7 });
const plaza = new THREE.Mesh(new THREE.CircleGeometry(3.2, 48), plazaMat);
plaza.rotation.x = -Math.PI / 2;
plaza.position.set(0, 0.05, 0);
plaza.receiveShadow = true;
scene.add(plaza);

// === Paths ===
// makes small walkway tiles with borders
function createPath(pathCenterX, pathCenterZ, width, length, angle = 0) {
  const main = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.02, length),
    new THREE.MeshStandardMaterial({ color: 0x8f8f8f, roughness: 0.9 })
  );
  main.position.set(pathCenterX, 0.01, pathCenterZ);
  main.rotation.y = angle;
  main.receiveShadow = true;

  const curbMat = new THREE.MeshStandardMaterial({ color: 0xdfdfdf, roughness: 1.0 });
  const curbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, length + 0.02), curbMat);
  const curbRight = curbLeft.clone();

  const dx = Math.sin(angle);
  const dz = Math.cos(angle);
  const half = (width / 2) + 0.04;

  curbLeft.position.set(pathCenterX + dx * half, 0.03, pathCenterZ + dz * half);
  curbLeft.rotation.y = angle;
  curbRight.position.set(pathCenterX - dx * half, 0.03, pathCenterZ - dz * half);
  curbRight.rotation.y = angle;
  curbLeft.castShadow = curbRight.castShadow = true;
  scene.add(main, curbLeft, curbRight);

  return main;
}

// campus paths
createPath(0, 8.5, 1.8, 12);
createPath(0, -8.5, 1.8, 12);
createPath(8.5, 0, 1.8, 12, Math.PI / 2);
createPath(-8.5, 0, 1.8, 12, Math.PI / 2);


// short path to plaza
createPath(0, 3.5, 1.6, 5);

// === Buildings ===
// helper to add buildings with shadows
function finalize(mesh) {
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

// top-left white building
function createTopLeft() {
  const mat = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 10 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 4), mat);
  b.position.set(-10, 3.5, 9);
  finalize(b);

  const entrance = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 0.3),
    new THREE.MeshLambertMaterial({ color: 0xe8e8e8 }));
  entrance.position.set(-10, 1.1, 11.2);
  finalize(entrance);
}
createTopLeft();

// bottom-right gray building
function createBottomRight() {
  const mat = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.6, metalness: 0.05 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(5.5, 6.5, 4.2), mat);
  b.position.set(10, 3.25, -6);
  finalize(b);

  const windowMat = new THREE.MeshBasicMaterial({ color: 0x2f2f2f });
  for (let i = -1; i <= 1; i++) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), windowMat);
    w.position.set(10 - 2.5 + (i * 1.5), 3.25, -4.79);
    w.rotation.y = 0;
    scene.add(w);
  }
}
createBottomRight();

// striped building on top-right
function createStripedBuilding(x, z) {
  const stripeColors = [0xff8a33, 0x9cdcf7, 0x6aa0ff];
  const stripeWidth = 2.8;
  const buildingWidth = 9;  // X dimension
  const stripesCount = Math.floor(buildingWidth / stripeWidth);
  const height = 8;         // Y dimension
  const depth = 8;          // Z dimension — now cube-like
  const startX = x - buildingWidth / 2 + stripeWidth / 2;

  const group = new THREE.Group();

  // === Stripes ===
  for (let i = 0; i < stripesCount; i++) {
    const color = stripeColors[i % stripeColors.length];
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.5,
      metalness: 0.05
    });

    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(stripeWidth, height, depth),
      mat
    );

    stripe.position.set(startX + i * stripeWidth, height / 2, z);
    stripe.castShadow = stripe.receiveShadow = true;
    group.add(stripe);
  }

  // === Roof  ===
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth, 0.2, depth),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3 })
  );
  roof.position.set(x - 0.3, height, z);
  roof.castShadow = roof.receiveShadow = true;
  group.add(roof);

  group.position.y = 0;
  // group.rotation.y = Math.PI; // rotate 90 degrees around Y-axis

  scene.add(group);
}

createStripedBuilding(11.5, 9);

// extra small building bottom-left
function createExtraBuilding() {
  const material = new THREE.MeshPhongMaterial({ color: 0xd1c4e9, shininess: 20 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(4.5, 5.5, 3.5), material);
  b.position.set(-8, 2.75, -7);
  finalize(b);

  const balcony = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x7b5e57, roughness: 0.7 }));
  balcony.position.set(-8, 2.1, -5.6);
  finalize(balcony);

  
}
createExtraBuilding();

// === Benches ===
function createBench(x, z, rot = 0) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x7b4f36, roughness: 0.6 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 0.45), wood);
  const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.35, 0.07), metal);
  const leg2 = leg1.clone();

  seat.position.set(x, 0.35, z);
  seat.rotation.y = rot;

  const legOffset = 0.65;
  const cosRot = Math.cos(rot);
  const sinRot = Math.sin(rot);

  leg1.position.set(
    x - (legOffset / 5) * cosRot,
    0.16,
    z - (legOffset / 2) * sinRot
  );

  leg2.position.set(
    x + (legOffset / 5) * cosRot,
    0.16,
    z + (legOffset / 2) * sinRot
  );

  leg1.rotation.y = rot;
  leg2.rotation.y = rot;

  scene.add(seat, leg1, leg2);
}


//benches
createBench(2.9, 10, 0.3);
createBench(2.9, -10, 0.3);

createBench(-2.9, 10, 0.3);
createBench(-2.9, -10, 0.3);

// === Lamps ===
function createLamp(x, z) {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.11, 2.6, 12),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  pole.position.set(x, 1.5, z);
  pole.castShadow = true;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshStandardMaterial({ emissive: 0xfff4c2, emissiveIntensity: 0.9, color: 0x222222 })
  );
  head.position.set(x, 2.65, z);

  const point = new THREE.PointLight(0xfff2cc, 0.8, 8);
  
  point.position.set(x, 2.6, z);

  scene.add(pole, head, point);
}

// lamps around plaza
createLamp(-10, 2);
createLamp(10, 2);
createLamp(5, 12);
createLamp(-5, 12);
createLamp(-10, -2);
createLamp(10, -2);
createLamp(5, -12);
createLamp(-5, -12);

// === Day/Night Toggle ===

// collect all lamp PointLights
const lampLights = [];
scene.traverse((obj) => {
  if (obj.isPointLight && obj !== plazaLight) {
    lampLights.push(obj);
    obj.intensity = 0; // start with lamps off
  }
});

let isDay = true;

function toggleDayNight() {
  isDay = !isDay;

  if (isDay) {
    // Day mode
    scene.background.set(0xbfd1e5); // light blue sky
    ambientLight.intensity = 0.35;
    dirLight.intensity = 0.8;
    hemiLight.intensity = 0.4;
    plazaLight.intensity = 0.6;
    lampLights.forEach(l => l.intensity = 0); // lamps off
  } else {
    // Night mode
    scene.background.set(0x0d0d2b); // dark night sky
    ambientLight.intensity = 0.1;
    dirLight.intensity = 0.1;
    hemiLight.intensity = 0.1;
    plazaLight.intensity = 0.1; // subtle plaza light
    lampLights.forEach(l => l.intensity = 0.8); // lamps on
  }
}

// Listen for "N" key
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'n') toggleDayNight();
});


document.getElementById('toggleDayNight').addEventListener('click', toggleDayNight);


const speed = 0.2; // movement speed
const move = { forward: false, backward: false, left: false, right: false };

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'w') move.forward = true;
    if (e.key.toLowerCase() === 's') move.backward = true;
    if (e.key.toLowerCase() === 'a') move.left = true;
    if (e.key.toLowerCase() === 'd') move.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key.toLowerCase() === 'w') move.forward = false;
    if (e.key.toLowerCase() === 's') move.backward = false;
    if (e.key.toLowerCase() === 'a') move.left = false;
    if (e.key.toLowerCase() === 'd') move.right = false;
});

function updateCamera() {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; // ignore vertical for flat movement
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    if (move.forward) camera.position.add(direction.clone().multiplyScalar(speed));
    if (move.backward) camera.position.add(direction.clone().multiplyScalar(-speed));
    if (move.left) camera.position.add(right.clone().multiplyScalar(speed));
    if (move.right) camera.position.add(right.clone().multiplyScalar(-speed));
}



// Map buttons to movement
const btnMap = {
  up: 'forward',
  down: 'backward',
  left: 'left',
  right: 'right'
};

Object.keys(btnMap).forEach(id => {
  const btn = document.getElementById(id);
  btn.addEventListener('mousedown', () => move[btnMap[id]] = true);
  btn.addEventListener('mouseup', () => move[btnMap[id]] = false);
  btn.addEventListener('mouseleave', () => move[btnMap[id]] = false);
  // For mobile touch
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); move[btnMap[id]] = true; });
  btn.addEventListener('touchend', (e) => { e.preventDefault(); move[btnMap[id]] = false; });
});


// === Trees ===
function createTree(x, z, scale = 1) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 1.2 * scale, 10),
    new THREE.MeshStandardMaterial({ color: 0x6b3e1e }));
  trunk.position.set(x, 0.6 * scale, z);
  trunk.castShadow = trunk.receiveShadow = true;

  const foliageMat = new THREE.MeshLambertMaterial({ color: 0x2d7a2d });
  const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.9 * scale, 1.0 * scale, 12), foliageMat);
  cone1.position.set(x, 1.45 * scale, z);
  const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.66 * scale, 0.85 * scale, 12), foliageMat);
  cone2.position.set(x, 1.95 * scale, z);
  const cone3 = new THREE.Mesh(new THREE.ConeGeometry(0.42 * scale, 0.6 * scale, 12), foliageMat);
  cone3.position.set(x, 2.35 * scale, z);

  trunk.castShadow = cone1.castShadow = cone2.castShadow = cone3.castShadow = true;
  trunk.receiveShadow = cone1.receiveShadow = cone2.receiveShadow = cone3.receiveShadow = true;

  scene.add(trunk, cone1, cone2, cone3);
}

// trees around area (surrounding the outer edges of the campus)
const treePositions = [
  [ -14, 14 ], // far top-left corner
  [ -10, 15 ], // top-left side, slightly closer to center
  [ -5, 16 ],  // top edge, slightly left
  [ 0, 16 ],   // top center (directly north of plaza)
  [ 5, 15 ],   // top-right area
  [ 10, 14 ],  // far top-right corner

  [ 14, 2.5 ],   // right edge, mid-upper section
  [ 13, -2 ],  // right-middle side
  [ 8, -12 ],  // lower-right corner
  [ 2, -14 ],  // bottom center-right

  [ -4, -13 ], // bottom center-left
  [ -10, -12 ],// lower-left side
  [ -14, -8 ], // left-lower area
  [ -15, -2 ], // left-middle side
  [ -15, 6 ]   // left-upper side
];

// create each tree at those positions
for (const [x, z] of treePositions) createTree(x, z, 1);


// small trees near plaza
createTree(3.5, 6.0, 1.8);
createTree(-5, 5.5, 1.8);
createTree(5.2, -4.5, 1.9);
createTree(-5, -2.5, 1.9);

// === Flowers ===
function scatterFlowers(centerX, centerZ, radius, count = 45) {
  const flowerColors = [0xff66b2, 0xffc857, 0xff8a8a, 0xffb3ff, 0x88ff88];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius * 0.9;
    const x = centerX + Math.cos(angle) * r;
    const z = centerZ + Math.sin(angle) * r;
    const y = 0.08 + Math.random() * 0.05;
    const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    const flower = new THREE.Mesh(new THREE.SphereGeometry(0.07 + Math.random() * 0.03, 8, 8),
      new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.0 }));
    flower.position.set(x, y, z);
    flower.castShadow = true;
    scene.add(flower);
  }
}
scatterFlowers(0, 0, 2.4, 60);

// === Add flat roofs to all other buildings ===
function addBuildingRoofs() {
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3 });

  // --- Roof for Top-Left White Building ---
  const topLeftRoof = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.2, 4),
    roofMat
  );
  topLeftRoof.position.set(-10, 7, 9); // same top Y + roof thickness
  topLeftRoof.castShadow = topLeftRoof.receiveShadow = true;
  scene.add(topLeftRoof);

  // --- Roof for Bottom-Right Gray Building ---
  const bottomRightRoof = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.2, 4.2),
    roofMat
  );
  bottomRightRoof.position.set(10, 6.5, -6);
  bottomRightRoof.castShadow = bottomRightRoof.receiveShadow = true;
  scene.add(bottomRightRoof);

  // --- Roof for Bottom-Left Purple Building ---
  const extraRoof = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.2, 3.5),
    roofMat
  );
  extraRoof.position.set(-8, 5.5, -7);
  extraRoof.castShadow = extraRoof.receiveShadow = true;
  scene.add(extraRoof);
}

addBuildingRoofs();




// === Small ground details ===
function smallStone(x, z) {
  const s = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x6f6f6f }));
  s.position.set(x, 0.015, z);
  scene.add(s);
}
smallStone(1.8, 1.1);
smallStone(-1.5, -0.9);
smallStone(4.1, -1.2);

// === Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animate ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
    updateCamera();
  renderer.render(scene, camera);
}
animate();
