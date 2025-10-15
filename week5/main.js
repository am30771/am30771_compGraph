// Import everything from the Three.js library
import * as THREE from 'three';

// Import orbit controls for camera interaction (mouse drag, zoom, etc.)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Import helper for visualizing rectangular area lights
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

// Import GUI tool for real-time tweaking of parameters
import GUI from 'lil-gui'

// Initialize a GUI interface
const gui = new GUI()

const scene = new THREE.Scene()

// Create a standard material (responds to lights)
const material = new THREE.MeshStandardMaterial()


// material.roughness = 0.4

// Create a sphere geometry mesh using the material
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32), material
)
sphere.position.x = -1.5 // Move the sphere to the left

// Create a cube using the same material
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75), material
)

// Create a torus geometry mesh and move it to the right
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64), material
)
torus.position.x = 1.5 // Move the torus to the right

// Create a large plane mesh to serve as a floor and rotate it flat
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5), material
)
plane.rotation.x = -Math.PI * 0.5  // Rotate 90 degrees around X-axis
plane.position.y = -0.65           // Lower the plane below the objects

// Add all meshes to the scene
scene.add(sphere, cube, torus, plane)

// Add an ambient light to the scene (uniform lighting from all directions)
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Add the ambient light's intensity to the GUI for live editing
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)

// Add a directional light (acts like sunlight)
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

// Visual helper for the directional light
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

// Add a hemisphere light (sky and ground color)
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9) 
scene.add(hemisphereLight)

// Visual helper for the hemisphere light
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.3)
scene.add(hemisphereLightHelper)

// Add a point light (emits light in all directions from a point)
const pointLight = new THREE.PointLight(0xff9000, 1.5, 0.2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

// Visual helper for the point light
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
scene.add(pointLightHelper)

// Add a rectangular area light (useful for studio lighting effects)
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 4, 3)
rectAreaLight.position.set(-1.5, 0, 1.5)
scene.add(rectAreaLight)

// Visual helper for the rectangular area light
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight, 0.3)
scene.add(rectAreaLightHelper)

// Create a spotlight with greenish color, high intensity, limited distance, narrow angle, penumbra, and decay
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1)
scene.add(spotLight) // Add the spotlight to the scene

// Set the spotlight’s position in the scene
spotLight.position.set(0, 2, 3)

// Aim the spotlight at a target positioned to the left on the X axis
spotLight.target.position.x = -0.75

// Add the spotlight to the scene again (already added above — this is redundant but harmless)
scene.add(spotLight)

// Add the spotlight's target object to the scene so the light can properly aim
scene.add(spotLight.target)

// Create a helper to visualize the spotlight’s cone and direction
const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.4)

// Add the helper to the scene
scene.add(spotLightHelper)

// Store viewport size in an object
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Update sizes and camera aspect ratio on window resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  RenderTarget.setSize(sizes.width, sizes.height)
})

// Create a perspective camera and position it
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 4)
scene.add(camera)

// Create the renderer and configure it
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

// Animation loop to render the scene continuously
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

// Start the animation loop
animate()
