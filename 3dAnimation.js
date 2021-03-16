
var model;
var leftMostPosLocal, rightMostPosLocal;
const scene = new THREE.Scene();
const graphicsCamera = new THREE.PerspectiveCamera(75, 640 / 720, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: animation_canvas });
renderer.setSize(680, 720);

const MODEL_PATH = 'https://threejs.org/examples/models/gltf/Soldier.glb';

graphicsCamera.position.z = 5;


// Lights
var light = new THREE.DirectionalLight(0xffffff, 5.0);
light.position.set( 0, 60, 5 );
light.rotation.x = -60 * Math.PI / 180;
light.rotation.y = -20 * Math.PI / 180;
var ambLight = new THREE.AmbientLight( 0x404040 ); // soft white light

const loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {

	model = gltf.scene;
	model.traverse(o => {
		if (o.isMesh) {
	  o.castShadow = true;
	  o.receiveShadow = true;
	}
});
model.position.set(0,(2-3.64),2);
model.rotation.y = Math.PI;
scene.add(model);
leftMostPosLocal = model.children[0].children[0].skeleton.bones[9].position;
rightMostPosLocal = model.children[0].children[0].skeleton.bones[26].position;
}, undefined, function (error) {

	console.error(error);

});

var planeGeometry = new THREE.PlaneGeometry( 20, 20, 1, 1 );
var planeMaterial = new THREE.MeshPhongMaterial( {
	color: 0xFFFFFF,
	side: THREE.DoubleSide,
	opacity: 0.2,
	transparent: true} );
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

var floor = new THREE.Mesh( planeGeometry, planeMaterial );
floor.rotation.x = 90 * Math.PI / 180;
floor.position.z = -10;
floor.position.y = -5;
scene.add(light, floor);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, graphicsCamera);

}
animate();