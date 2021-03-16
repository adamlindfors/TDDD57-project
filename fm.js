const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');


    /* Mediapipe Pose list 
    Left hand = 15
    Right hand = 16
    Left elbow = 13
    Right elbow = 14
    */

    /* Three js bones list
    Left hand = 9
    Right hand = 26
    Left elbow = 8
    Right elbow = 25
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



function updateBones(lndmrks){
  var posVec = new THREE.Vector3(0,0,0);
  var mappedX = 0;
  var mappedY = 0;
  //Right hand 
  mappedX = lndmrks[16].x.map(1, 0, rightMostPosLocal.x, leftMostPosLocal.x);
  mappedY = -lndmrks[16].y.map(0, 1, -1, 1);
  //posVec = model.children[0].children[0].skeleton.bones[26].position.set(mappedX, mappedY, 0 );
  model.children[0].children[0].skeleton.bones[26].position.set(mappedX, leftMostPosLocal.y, 2);
  console.log(lndmrks[16].x);
  //Left hand  
  //posVec = model.children[0].children[0].skeleton.bones[9].worldToLocal(new THREE.Vector3(lndmrks[15].x*10,lndmrks[15].y*10,  2));
  //model.children[0].children[0].skeleton.bones[9].position.set(posVec.x, posVec.y, 2);
  // Right forearm 25
  mappedX = lndmrks[14].x.map(0, 1, leftMostPosLocal.x, rightMostPosLocal.x);
  mappedY = -lndmrks[14].y.map(0, 1, -1, 1);
  //posVec = model.children[0].children[0].skeleton.bones[25].position.set(mappedX, mappedY, 0 );
  model.children[0].children[0].skeleton.bones[25].position.set(mappedX, leftMostPosLocal.y, 2);
  // Left forearm 8
  //model.children[0].children[0].skeleton.bones[8].position.set(lndmrks[13].x*10, lndmrks[13].y*10, lndmrks[13].z);
  //console.log(lndmrks[16].y);
  //var bla = model.children[0].children[0].skeleton.bones[25].position;
  //var test = model.children[0].children[0].skeleton.bones[26].localToWorld(new THREE.Vector3(bla.x, bla.y, bla.z));
  //console.log(test);
}



function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: '#00FF00', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  if(model){
    updateBones(results.poseLandmarks);
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