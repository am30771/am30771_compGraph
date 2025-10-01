import * as THREE from 'three';
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x202020);
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z=7;
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
const geometry=new THREE.BoxGeometry(1,1,1);
const material=new THREE.MeshBasicMaterial({color:0xff0000 });
const cudeMesh=new THREE.Mesh(geometry,material);
// scene.add(cudeMesh);  

// cudeMesh.position.x=0.7;
// cudeMesh.position.y=-0.6;
// cudeMesh.position.z=1;
// cudeMesh.position.set(0.7,-0.6,1);
console.log("Distance from camera",cudeMesh.position.distanceTo(camera.position));

//Axes helper
const axes=new THREE.AxesHelper(14)
scene.add(axes)
//scaling
// cudeMesh.scale.set(2,0.25,0.5)
//rotating
// cudeMesh.rotation.x=Math.PI*0.25
// cudeMesh.rotation.y=Math.PI*0.25
// cudeMesh.rotation.z=Math.PI*0.25


// cudeMesh.position.x=0.7;
// cudeMesh.position.y=-0.6;
// cudeMesh.position.z=1;
// cudeMesh.scale.set(2,0.25,0.5)
// cudeMesh.rotation.y=Math.PI*0.25
// cudeMesh.rotation.z=Math.PI*0.25


const group=new THREE.Group()
group.scale.y=2
group.scale.x=2
 group.rotation.y=0.5
scene.add(group)


const cube1=new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000 })
)

cube1.position.x=-1.5
cube1.rotation.x=0.5
group.add(cube1)

const cube2=new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000 })
)

cube2.position.x=0
group.add(cube2)

const cube3=new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:0xff0000 })
)

cube3.position.x=1.5
group.add(cube3)

const light =new THREE.DirectionalLight(0xffffff,1);
light.position.set(2,2,5);
scene.add(light);
function animate(){
    requestAnimationFrame(animate);
    // cudeMesh.rotation.x+=0.01;
    //  cudeMesh.rotation.y+=0.01;
    renderer.render(scene,camera);
}
animate();