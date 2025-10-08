import * as THREE from 'three';

// Create a new scene where all objects, lights, and cameras live
const scene = new THREE.Scene();
// Set the background color of the scene to a dark gray
scene.background = new THREE.Color(0x202020);

// Create a perspective camera with a 75-degree field of view and aspect ratio of 800/600
const camera = new THREE.PerspectiveCamera(75, 800 / 600);
// Move the camera away from the origin along the z-axis so we can see the objects
camera.position.z = 3;

// Set up the WebGL renderer with antialiasing for smoother edges
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Set the size of the rendering area (canvas) to 800 by 600 pixels
renderer.setSize(800, 600);
// Add the renderer's canvas element to the HTML document so it becomes visible
document.body.appendChild(renderer.domElement);

// Create a torus (donut-shaped) geometry with radius 1, tube radius 0.4, 16 radial segments, and 100 tubular segments
const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);

// Uncomment the following lines to try different shapes:
// const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
// const geometry = new THREE.SphereGeometry(1, 32, 32);
// const geometry = new THREE.ConeGeometry(1, 2, 10);

// Different materials to try (uncomment to experiment):
// Basic material with red wireframe: 
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe:true });

// Lambert material with purple color (affected by lights):
// const material = new THREE.MeshLambertMaterial({ color: 0x8844ff });

// Standard material with metalness, roughness, and emissive color:
// const material = new THREE.MeshStandardMaterial({ color: 0x8844ff, metalness: 0.4, roughness: 0.3, emissive: 0x220044 });

// Currently using Phong material which supports specular highlights and shininess
const material = new THREE.MeshPhongMaterial({ color: 0x8844ff, specular: 0xffffff, shininess: 100 });

// Combine geometry and material into a mesh (3D object)
const object = new THREE.Mesh(geometry, material);
// Add the mesh to the scene so it will be rendered
scene.add(object);

// Add ambient light to softly illuminate all objects equally
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Add directional light to create stronger lighting and shadows from a specific direction
const light = new THREE.DirectionalLight(0xffffff, 1);
// Position the directional light slightly in front and to the side of the scene
light.position.set(1, 1, 5);
scene.add(light);

// Add a helper to visualize the position and direction of the directional light
const lightHelper = new THREE.DirectionalLightHelper(light, 0.4);
scene.add(lightHelper);

// Animation loop to continuously render the scene and update object rotation
function animate() {
  // Request the browser to call this function again on the next frame
  requestAnimationFrame(animate);

  // Rotate the object slightly on the x and y axes each frame for animation
  object.rotation.x += 0.01;
  object.rotation.y += 0.01;

  // Render the current state of the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
