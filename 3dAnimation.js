
const scene = new THREE.Scene();
const graphicsCamera = new THREE.PerspectiveCamera(75, 640 / 720, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: animation_canvas });
renderer.setSize(680, 720);

graphicsCamera.position.z = 5;
graphicsCamera.position.x = 2


// Lights
var light = new THREE.DirectionalLight(0xffffff, 5.0);
light.position.set( 0, 60, 5 );
light.rotation.x = -60 * Math.PI / 180;
light.rotation.y = -20 * Math.PI / 180;

//Geometry
var planeGeometry = new THREE.PlaneGeometry( 20, 20, 1, 1 );
var planeMaterial = new THREE.MeshPhongMaterial( {
	color: 0xFFFFFF,
	side: THREE.DoubleSide,
	opacity: 0.2,
	transparent: true} );

var floor = new THREE.Mesh( planeGeometry, planeMaterial );
floor.rotation.x = 90 * Math.PI / 180;
floor.position.z = -10;
floor.position.y = -5;

const geometry = new THREE.SphereGeometry( 0.05, 32, 32 );
const rightMaterial = new THREE.MeshBasicMaterial( {color: 0x2F32FA} );
const leftMaterial = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
const rightSphere = new THREE.Mesh( geometry, rightMaterial );
const leftSphere = new THREE.Mesh( geometry, leftMaterial );


scene.add(light, floor, leftSphere, rightSphere);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, graphicsCamera);

}
animate();