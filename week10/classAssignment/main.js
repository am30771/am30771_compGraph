import * as THREE from 'three';

// ---------------------------
// Scene & Camera
// ---------------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Position camera directly in front
camera.position.set(0, 1.5, 6);
camera.lookAt(0, 0.75, 0);

// ---------------------------
// Renderer
// ---------------------------
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------------------------
// Texture Loader
// ---------------------------
const loader = new THREE.TextureLoader();

// Background
const bgTexture = loader.load('textures/Stylized_Stone_Floor_010_roughness.png');
scene.background = bgTexture;

// Textures
const baseColorTex = loader.load('textures/Stylized_Stone_Floor_010_basecolor.png');
const normalTex = loader.load('textures/Stylized_Stone_Floor_010_normal.png');
const heightTex = loader.load('textures/Stylized_Stone_Floor_010_height.png');

// ---------------------------
// Cube (base color)
// ---------------------------
const cubeMaterial = new THREE.MeshStandardMaterial({
  map: baseColorTex,
  roughness: 0.8
});

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  cubeMaterial
);
cube.position.set(-2, 0.5, 0);
scene.add(cube);

// ---------------------------
// Sphere (displacement map + base color)
// ---------------------------
const sphereMaterial = new THREE.MeshStandardMaterial({
  map: baseColorTex,
  displacementMap: heightTex,
  displacementScale: 0.2,
  roughness: 0.8
});

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.75, 128, 128),
  sphereMaterial
);
sphere.position.set(0, 0.75, 0);
scene.add(sphere);

// ---------------------------
// Torus (normal map + base color)
// ---------------------------
const torusMaterial = new THREE.MeshStandardMaterial({
  map: baseColorTex,
  normalMap: normalTex,
  roughness: 0.8
});

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.7, 0.25, 32, 100),
  torusMaterial
);
torus.position.set(2, 0.8, 0);
scene.add(torus);

// ---------------------------
// Lights
// ---------------------------
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambLight);

// ---------------------------
// Animate
// ---------------------------
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.y += 0.01;
  sphere.rotation.y += 0.01;
  torus.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// ---------------------------
// Resize Handler
// ---------------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
