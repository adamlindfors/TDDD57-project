const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const textureLoader = new THREE.TextureLoader()
textureLoader.crossOrigin = "Anonymous"
const ammoTexture = textureLoader.load("battery_white.png")


    /* Mediapipe Pose list 
    Left hand = 15
    Right hand = 16
    Left elbow = 13
    Right elbow = 14
    */
var monster = function(){
  this.position = new THREE.Vector3(10, 0, 0);
  this.velocity = new THREE.Vector3(-1,0,0);
  this.geometry = new THREE.BoxGeometry( 1, 1, 1 );
  this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  this.mesh = new THREE.Mesh( this.geometry, this.material );
  this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  this.boundingBox = new THREE.Box3();
  this.mesh.geometry.computeBoundingBox();
}
monster.prototype = {
  update: function(){
    var tempVel = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.y);
    this.position.add(tempVel.multiplyScalar(0.03));
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }
}
var monster1 = new monster();
scene.add(monster1.mesh);


var ammoBox = function() {
  this.position = new THREE.Vector3(0,-1,0);
  this.radius = 0.4;
  this.red = 0;
  this.green = 1;
  this.blue = 0;
  this.scale = 1.0;
  this.geometry = new THREE.CircleGeometry( this.radius, 18 );
  this.material = new THREE.MeshBasicMaterial( { map:ammoTexture, color:"rgb(${this.red}, ${this.green}, ${this.blue})" } );
  this.mesh = new THREE.Mesh( this.geometry, this.material );  
  this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  this.box = new THREE.Box3();
  this.mesh.geometry.computeBoundingBox();
}
ammoBox.prototype = {
  giveAmmo: function(myCannon) {
        this.red += 0.05*myCannon.rgb.x;
        this.green -= 0.05*this.green;
        this.blue += 0.05*myCannon.rgb.z;
        this.scale += 0.005;
        if(this.scale > 1.1){
          this.scale = 1.1;
        }
        if(this.red > 1.0) {
          this.red = 1.0;
        }
        if(this.blue > 1.0) {
          this.blue = 1.0;
        }
        this.material.color.setRGB(this.red, this.green, this.blue);
        this.mesh.scale.set(this.scale, this.scale, this.scale);
        if(this.red == 1.0 || this.blue == 1.0) {
          myCannon.numberOfAmmo = 100;
        }
        
  }
}


var test = new ammoBox();
scene.add(test.mesh);

var particle = function(material){
  this.ammoGeometry = new THREE.SphereGeometry(0.09, 6, 6);
  this.ammoMaterial = material;
  this.mesh = new THREE.Mesh(this.ammoGeometry, this.ammoMaterial);
  this.position = new THREE.Vector3(100,100,100);
  this.velocity = new THREE.Vector3(0.0,0.0,0.0);
  this.lifeLength = Math.random();
  this.mesh.position.set(this.position.x, this.position.y, this.position.z);
}
particle.prototype = {
  respawn: function(startPos, forearmLandmark){
    if(this.lifeLength < 0.0){
      this.position.set(startPos.x, startPos.y, startPos.z);
      this.mesh.position.set(startPos.x, startPos.y, startPos.z);
      this.lifeLength = Math.random();
      var tempVel = new THREE.Vector3(startPos.x - forearmLandmark.x, 
                                      startPos.y - -(forearmLandmark.y), 
                                      0.0);
      tempVel = tempVel.normalize().multiplyScalar(5);
      this.velocity.set(tempVel.x, tempVel.y, tempVel.z);
    }
  },
  update: function() {
    var tempVel = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z);
    tempVel.y += -9.82*0.01;
    this.velocity.set(tempVel.x, tempVel.y, tempVel.z);
    this.mesh.position.add(tempVel.multiplyScalar(0.03));
  }
}

var handCannon = function(mesh, material, side, rgb){
  this.side = side;
  this.rgb = rgb;
	this.position = new THREE.Vector3(0,0,0);
  this.numberOfAmmo = 100;
  this.mesh = mesh;
  this.ammo = [];
  this.ammoMaterial = material;
  this.box = new THREE.Box3();
  this.mesh.geometry.computeBoundingBox();
}
handCannon.prototype = {
  loadParticles: function(){
    for(var i = 0; i < this.numberOfAmmo; i++){
      this.ammo.push(new particle(this.ammoMaterial));
      scene.add(this.ammo[this.ammo.length - 1].mesh);
    }
    this.numberOfAmmo = 0;
  },
  moveCannon: function(handLandmark){
    this.position.set(handLandmark.x, -handLandmark.y, 0);
    this.mesh.position.set(handLandmark.x, -handLandmark.y, 0);
    this.box.copy( this.mesh.geometry.boundingBox ).applyMatrix4( this.mesh.matrixWorld );
  }
}

var leftHandCannon = new handCannon(leftSphere, leftMaterial , "left", new THREE.Vector3(1,0,0));
var rightHandCannon = new handCannon(rightSphere, rightMaterial , "right", new THREE.Vector3(0,0,1));
rightHandCannon.loadParticles();
leftHandCannon.loadParticles();
var cannons = [];
cannons.push(rightHandCannon);
cannons.push(leftHandCannon);
var ammotimer = 0;

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  leftHandCannon.moveCannon(results.poseLandmarks[15]);
  rightHandCannon.moveCannon(results.poseLandmarks[16]);
  for(var i = 0; i < cannons.length; i++){
    for(var j = 0; j < cannons[i].ammo.length; j++){
      cannons[i].ammo[j].lifeLength -= 0.01;
      if(cannons[i].numberOfAmmo > 0 && cannons[i].ammo[j].lifeLength <= 0.0){
        if(cannons[i].side == "right") {
          cannons[i].ammo[j].respawn(cannons[i].position, results.poseLandmarks[14]);
        }
        else {
          cannons[i].ammo[j].respawn(cannons[i].position, results.poseLandmarks[13]);
        }
        cannons[i].numberOfAmmo -=1;
        if(cannons[i].numberOfAmmo <= 0) {
          cannons[i].numberOfAmmo = 0;
        }
      }
      cannons[i].ammo[j].update();
    }
  }
  if(test.box.intersectsBox(rightHandCannon.box) && !test.box.intersectsBox(leftHandCannon.box)){
    test.giveAmmo(rightHandCannon);
  } else if(test.box.intersectsBox(leftHandCannon.box) && !test.box.intersectsBox(rightHandCannon.box)) {
    test.giveAmmo(leftHandCannon);
  } else if(!test.box.intersectsBox(leftHandCannon.box) && !test.box.intersectsBox(rightHandCannon.box)) {
    test.mesh.scale.set(1.0,1.0,1.0);
    test.red = 0;
    test.green = 1;
    test.blue = 0;
    test.scale = 1.0;
    test.material.color.setRGB(test.red, test.green, test.blue);
  }
  
  test.box.copy( test.mesh.geometry.boundingBox ).applyMatrix4( test.mesh.matrixWorld );
  monster1.update();
  console.log(monster1.position);
}




const holistic = new Holistic({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
}});
holistic.setOptions({
  upperBodyOnly: false,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
holistic.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width: 640,
  height: 720
});
camera.start();