const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "Anonymous";
const ammoTexture = textureLoader.load("images/battery_white.png");
const blueMonsterTexture1 = textureLoader.load("images/blue-monster1.png");
const blueMonsterTexture2 = textureLoader.load("images/blue-monster2.png");
const blueMonsterTexture3 = textureLoader.load("images/blue-monster3.png");
const redMonsterTexture1 = textureLoader.load("images/red-monster1.png");
const redMonsterTexture2 = textureLoader.load("images/red-monster2.png");
const redMonsterTexture3 = textureLoader.load("images/red-monster3.png");
const leftHandTexture = textureLoader.load("images/left-hand.png");
const rightHandTexture = textureLoader.load("images/right-hand.png");
const barrier1 = textureLoader.load("images/barrier-1.png");
const barrier2 = textureLoader.load("images/barrier-2.png");
const barrier3 = textureLoader.load("images/barrier-3.png");
const barrier4 = textureLoader.load("images/barrier-4.png");
const barrier5 = textureLoader.load("images/barrier-5.png");
const endScreenTexture = textureLoader.load("images/game-over1.png");
var monstereDeath = new Audio('Audio/monsterDeath.wav');
var cannonFire = new Audio('Audio/cannon.flac');

    /* Mediapipe Pose list 
    Left hand = 15
    Right hand = 16
    Left elbow = 13
    Right elbow = 14
    */

  var playerHealth = 5;
  var barrierGeometry = new THREE.PlaneGeometry( 3.0, 4.0, 1.0 );
  var barrierMaterial5 = new THREE.MeshBasicMaterial( {map: barrier5, alphaTest: 0.5} );
  var barrierMesh5 = new THREE.Mesh( barrierGeometry, barrierMaterial5 );
  barrierMesh5.position.set(0, -1, 0);
  var barrierMaterial4 = new THREE.MeshBasicMaterial( {map: barrier4, alphaTest: 0.5} );
  var barrierMesh4 = new THREE.Mesh( barrierGeometry, barrierMaterial4 );
  barrierMesh4.position.set(0, -100, 0);
  var barrierMaterial3 = new THREE.MeshBasicMaterial( {map: barrier3, alphaTest: 0.5} );
  var barrierMesh3 = new THREE.Mesh( barrierGeometry, barrierMaterial3 );
  barrierMesh3.position.set(0, -100, 0);
  var barrierMaterial2 = new THREE.MeshBasicMaterial( {map: barrier2, alphaTest: 0.5} );
  var barrierMesh2= new THREE.Mesh( barrierGeometry, barrierMaterial2 );
  barrierMesh2.position.set(0, -100, 0);
  var barrierMaterial1 = new THREE.MeshBasicMaterial( {map: barrier1, alphaTest: 0.5} );
  var barrierMesh1 = new THREE.Mesh( barrierGeometry, barrierMaterial1 );
  barrierMesh1.position.set(0, -100, 0);
  scene.add(barrierMesh5, barrierMesh4, barrierMesh3, barrierMesh2, barrierMesh1);

  var endScreenGeometry = new THREE.PlaneGeometry( 6.0, 10.0, 1.0 );
  var endScreenMaterial = new THREE.MeshBasicMaterial( {map: endScreenTexture, alphaTest: 0.5} );
  var endScreenMesh = new THREE.Mesh( endScreenGeometry, endScreenMaterial );
  endScreenMesh.position.set(100,100,100);
  scene.add(endScreenMesh);

var monster = function(texture, color){
  this.position = new THREE.Vector3(Math.random() * (10 - 7) + 7, Math.random() * (2 - (-2)) -2, 0);
  this.velocity = new THREE.Vector3(-1,0,0);
  this.geometry = new THREE.PlaneGeometry( 1.0, 1.0, 1.0 );
  this.material = new THREE.MeshBasicMaterial( {map: texture, alphaTest: 0.5} );
  this.mesh = new THREE.Mesh( this.geometry, this.material );
  this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  this.box = new THREE.Box3();
  this.mesh.geometry.computeBoundingBox();
  this.life = 30;
  this.color = color;
}
monster.prototype = {
  update: function(){
    var tempVel = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.y);
    this.position.add(tempVel.multiplyScalar(0.03));
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.box.copy( this.mesh.geometry.boundingBox ).applyMatrix4( this.mesh.matrixWorld );
  },
  hitByPlayer: function(myParticle){
    
    if(myParticle.box.intersectsBox(this.box)) {
      if(this.color == "blue" && myParticle.ammoMaterial.color.b > 0.5) {
      this.life -= 1;
      myParticle.position.set(100,100,100);
      myParticle.mesh.position.set(100,100,100);
      }
      else if(this.color == "red" && myParticle.ammoMaterial.color.r > 0.5) {
        this.life -= 1;
        myParticle.position.set(100,100,100)
        myParticle.mesh.position.set(100,100,100);
        }
    }
    if(this.life <= 0) {
      monstereDeath.play();
      this.respawn();
      this.life = 30;
    }
  },
  respawn: function() {
    this.position.set(Math.random() * (17 - 10) + 10, Math.random() * (2 - (-2)) -2, 0);
    this.velocity.x = Math.random() * (-1 - -(-1.5)) - 1.5;
  },


}
var monster1 = new monster(blueMonsterTexture1, "blue");
var monster2 = new monster(blueMonsterTexture2, "blue");
var monster3 = new monster(blueMonsterTexture3, "blue");
var monster4 = new monster(redMonsterTexture1, "red");
var monster5 = new monster(redMonsterTexture2, "red");
var monster6 = new monster(redMonsterTexture3, "red");
scene.add(monster1.mesh);
scene.add(monster2.mesh);
scene.add(monster3.mesh);
scene.add(monster4.mesh);
scene.add(monster5.mesh);
scene.add(monster6.mesh);
var monsters = [];
monsters.push(monster1);
monsters.push(monster2);
monsters.push(monster3);
monsters.push(monster4);
monsters.push(monster5);
monsters.push(monster6);
console.log(monster6)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


var ammoBox = function() {
  this.position = new THREE.Vector3(0,-1,0);
  this.radius = 0.4;
  this.red = 220/255;
  this.green = 255/255;
  this.blue = 180/255;
  this.scale = 1.0;
  this.geometry = new THREE.CircleGeometry( this.radius, 18 );
  this.material = new THREE.MeshBasicMaterial( { map:ammoTexture, color:"rgb(${this.red}, ${this.green}, ${this.blue})", alphaTest: 0.5 } );
  this.mesh = new THREE.Mesh( this.geometry, this.material );  
  this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  this.box = new THREE.Box3();
  this.mesh.geometry.computeBoundingBox();
}
ammoBox.prototype = {
  giveAmmo: async function(myCannon) {
        if(myCannon.rgb.x == 0) {
          this.red -= 0.1*this.red;
        } else if(myCannon.rgb.x == 1) {
          this.red += 0.1*this.red;
        }
        this.green -= 0.1*this.green;
        if(myCannon.rgb.z == 0) {
          this.blue -= 0.1*this.blue;
        } else if(myCannon.rgb.z == 1) {
          this.blue += 0.1*this.blue;
        }
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
          await sleep(1500);
          myCannon.numberOfAmmo = 100;
        }
        
  }
}

var ammoHand = function(pos, texture) {
  this.geometry = new THREE.PlaneGeometry( 1, 1, 1 );
  this.material = new THREE.MeshBasicMaterial( { map: texture} );
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.set(pos.x, pos.y, pos.z);
  scene.add(this.mesh);
}

var leftAmmoHand = new ammoHand(new THREE.Vector3(0, 5, -3), rightHandTexture);
var rightAmmoHand = new ammoHand(new THREE.Vector3(-2, 5, -3), leftHandTexture);

var myAmmoBox = new ammoBox();
scene.add(myAmmoBox.mesh);

var particle = function(material){
  this.ammoGeometry = new THREE.SphereGeometry(0.09, 6, 6);
  this.ammoMaterial = material;
  this.mesh = new THREE.Mesh(this.ammoGeometry, this.ammoMaterial);
  this.position = new THREE.Vector3(100,100,100);
  this.velocity = new THREE.Vector3(0.0,0.0,0.0);
  this.lifeLength = Math.random();
  this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  this.box = new THREE.Box3();
  this.mesh.geometry.computeBoundingBox();
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
      if(cannonFire.paused) {
        cannonFire.play();
      } else{
        cannonFire.currentTime = 0;
      }
      
    }
  },
  update: function() {
    var tempVel = new THREE.Vector3(this.velocity.x, this.velocity.y, this.velocity.z);
    tempVel.y += -9.82*0.01;
    this.velocity.set(tempVel.x, tempVel.y, tempVel.z);
    this.mesh.position.add(tempVel.multiplyScalar(0.03));
    this.box.copy( this.mesh.geometry.boundingBox ).applyMatrix4( this.mesh.matrixWorld );
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
      for(var k = 0; k < monsters.length; k++){
        monsters[k].hitByPlayer(cannons[i].ammo[j]);
      }
    }
  }
  for(var i = 0; i < monsters.length; i++){
    if(monsters[i].position.x < -1) {
      monsters[i].respawn();
      playerHealth -= 1;
    }
    if(playerHealth == 4) {
      barrierMesh5.position.set(0,-100,0);
      barrierMesh4.position.set(0,-1,0);
    }else if(playerHealth == 3){
      barrierMesh4.position.set(0,-100,0);
      barrierMesh3.position.set(0,-1,0);
    }else if(playerHealth == 2){
      barrierMesh3.position.set(0,-100,0);
      barrierMesh2.position.set(0,-1,0);
    }else if(playerHealth == 1){
      barrierMesh2.position.set(0,-100,0);
      barrierMesh1.position.set(0,-1,0);
    }else if(playerHealth < 1) {
      monsters[i].mesh.geometry.dispose();
      monsters[i].mesh.material.dispose();
      scene.remove(monsters[i]);
      endScreenMesh.position.set(2,0,0);
    }
  }

  if(myAmmoBox.box.intersectsBox(rightHandCannon.box) && !myAmmoBox.box.intersectsBox(leftHandCannon.box)){
    myAmmoBox.giveAmmo(rightHandCannon);
  } else if(myAmmoBox.box.intersectsBox(leftHandCannon.box) && !myAmmoBox.box.intersectsBox(rightHandCannon.box)) {
    myAmmoBox.giveAmmo(leftHandCannon);
  } else if(!myAmmoBox.box.intersectsBox(leftHandCannon.box) && !myAmmoBox.box.intersectsBox(rightHandCannon.box)) {
    myAmmoBox.mesh.scale.set(1.0,1.0,1.0);
    myAmmoBox.red = 220/255;
    myAmmoBox.green = 255/255;
    myAmmoBox.blue = 180/255;
    myAmmoBox.scale = 1.0;
    myAmmoBox.material.color.setRGB(myAmmoBox.red, myAmmoBox.green, myAmmoBox.blue);
  }
  myAmmoBox.box.copy( myAmmoBox.mesh.geometry.boundingBox ).applyMatrix4( myAmmoBox.mesh.matrixWorld );
  monster1.update();
  monster2.update();
  monster3.update();
  monster4.update();
  monster5.update();
  monster6.update();
  rightAmmoHand.material.color.setRGB(0, 0, rightHandCannon.numberOfAmmo/100);
  if(rightAmmoHand.material.color.b == 0) {
    rightAmmoHand.material.color.setRGB(1,1,1);
  }
  leftAmmoHand.material.color.setRGB(leftHandCannon.numberOfAmmo/100, 0, 0);
  if(leftAmmoHand.material.color.r == 0) {
    leftAmmoHand.material.color.setRGB(1,1,1);
  }
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