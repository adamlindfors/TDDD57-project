const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


    /* Mediapipe Pose list 
    Left hand = 15
    Right hand = 16
    Left elbow = 13
    Right elbow = 14
    */

// QUEUE CODE-------------------------------------------------

function Queue() {
  this.elementsX = [];
  this.elementsY = [];
}
Queue.prototype.enqueue = function (e1, e2) {
  this.elementsX.push(e1);
  this.elementsY.push(e2);
};
Queue.prototype.dequeue = function () {
  this.elementsX.shift();
  this.elementsY.shift();
};
Queue.prototype.isEmpty = function () {
  if(this.elementsX.length == 0 && this.elementsY.length == 0){
    return true
  }
  return false
};
Queue.prototype.peek = function () {
  return [!this.isEmpty() ? this.elementsX[0] : undefined, !this.isEmpty() ? this.elementsY[0] : undefined];
};
Queue.prototype.length = function() {
  return this.elementsX.length;
}
// QUEUE CODE-------------------------------------------------

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var ammoBox = function() {
  this.position = new THREE.Vector3(0,-5,0);
  this.geometry = new THREE.CircleGeometry( 0.4, 18 );
  this.material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  this.mesh = new THREE.Mesh( this.geometry, this.material );  
}
var ammobox = new ammoBox();
scene.add(ammobox.mesh);
console.log(ammobox);

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
      this.lifeLength = 5.0;
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

var handCannon = function(mesh, material, side){
  this.side = side;
	this.position = new THREE.Vector3(0,0,0);
  this.numberOfAmmo = 100;
  this.mesh = mesh;
  this.ammo = [];
  this.ammoMaterial = material;
}
handCannon.prototype = {
  loadParticles: function(){
    for(var i = 0; i < this.numberOfAmmo; i++){
      this.ammo.push(new particle(this.ammoMaterial));
      scene.add(this.ammo[this.ammo.length - 1].mesh);
    }
  },
  moveCannon: function(handLandmark){
    this.position.set(handLandmark.x, -handLandmark.y, 0);
    this.mesh.position.set(handLandmark.x, -handLandmark.y, 0);
  }
}

var leftHandCannon = new handCannon(leftSphere, leftMaterial , "left");
var rightHandCannon = new handCannon(rightSphere, rightMaterial , "right");
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
  /*for(var i = 0; i < rightHandCannon.ammo.length; i++) {
    if(rightHandCannon.numberOfAmmo > 0 && rightHandCannon.ammo[i].lifeLength <= 0.0) {
      rightHandCannon.ammo[i].respawn(rightHandCannon.position, results.poseLandmarks[14]);
      rightHandCannon.numberOfAmmo -= 1;
      if(rightHandCannon.numberOfAmmo <= 0) {
        rightHandCannon.numberOfAmmo = 0;
      }
    }
    rightHandCannon.ammo[i].update();
  }*/
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