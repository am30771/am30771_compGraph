import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'

// Small on-screen control panel (GUI)
const gui = new GUI()

// Create the 3D scene
const scene = new THREE.Scene()

//  Ambient Light 
// A soft, general light that lights up everything equally
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
// Add a GUI slider to control the light intensity
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
// Add the ambient light to the scene
scene.add(ambientLight)

//  Directional Light 
// A light that shines from one direction (like sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3)
directionalLight.castShadow = true // allow it to cast shadows
directionalLight.position.set(2, 2, -1) // position it in the scene
// Add a GUI slider for its intensity
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
// Add it to the scene
scene.add(directionalLight)

//  Spot Light 
// A light that shines in a cone shape (like a flashlight)
const spotLight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI * 0.3)
spotLight.castShadow = true // enable shadow casting
spotLight.position.set(0, 2, 2) // place it above and in front
// Add both the light and its target (the point it shines at)
scene.add(spotLight)
scene.add(spotLight.target)


// Create a point light (emits light in all directions from one point)
const pointLight = new THREE.PointLight(0xffffff, 2) 
pointLight.castShadow = true // Enable shadows for this light
pointLight.position.set(-1, 1, 0) // Position the light
scene.add(pointLight) // Add it to the scene

// Create a standard material that reacts to light
const material = new THREE.MeshStandardMaterial({ roughness: 0.8 })
// Add GUI controls to adjust material metalness and roughness
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

// Create a sphere mesh (object) using a sphere geometry and the material
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32), // <-- note: must be 'SphereGeometry'
  material
)
sphere.castShadow = true // Allow the sphere to cast shadows

// Create a plane mesh (like a ground) using plane geometry and the same material
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)
plane.receiveShadow = true // Allow the plane to receive shadows
// Rotate the plane so it lies flat like a floor
plane.rotation.x = -Math.PI * 0.5 // Rotate 90° around the X axis
plane.position.y = -0.5 // Slight rotation around the Y axis
// Add both the sphere and the plane to the scene
scene.add(sphere, plane)


// Store current window size for use with the camera and renderer
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Add a perspective camera
// Parameters: (field of view, aspect ratio, near clipping, far clipping)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

// Set the camera’s position in 3D space (x, y, z)
camera.position.set(1, 1, 5)

// Add the camera to the scene
scene.add(camera)


// Create the WebGL renderer (it draws the scene on the screen)
const renderer = new THREE.WebGLRenderer({ antialias: true }) // antialias makes edges smoother
// Enable shadow rendering
renderer.shadowMap.enabled = true
// Set the renderer size to match the window dimensions
renderer.setSize(sizes.width, sizes.height)
// Add the renderer's canvas element to the page so it’s visible in the browser
document.body.appendChild(renderer.domElement)

// Create orbit controls to move around the scene with the mouse
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // Adds smooth motion when dragging

// Create a clock to track elapsed time
const clock = new THREE.Clock()

// Animation loop function (runs every frame)
function tick() {
  // Get how much time has passed since the clock started
  const elapsedTime = clock.getElapsedTime()

  // Animate the sphere’s position in a circular motion
  sphere.position.x = Math.cos(elapsedTime) * 1.5
  sphere.position.z = Math.sin(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) // Bounce up and down

  // Update camera controls (smooth motion)
  controls.update()

  // Render (draw) the scene from the camera’s point of view
  renderer.render(scene, camera)

  // Call tick() again on the next animation frame
  requestAnimationFrame(tick)
}

// Start the animation loop
tick()
