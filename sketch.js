// Using The Coding Train's tutorial video:
// https://www.youtube.com/watch?v=T99fNXTUUaQ&list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y&index=1
// Calico Randall
// August 25, 2025
// COCO dataset - common objects in context
// Good reference: Humans of AI and MoveNet blog post

// Body detection variables
let video;
let bodyPose;
let poses = [];
let lerpedX = 0;
let lerpedY = 0;

// Perlin Noise variables
var inc = 0.1;
var scl = 10;
var cols, rows;
var zoff = 0;
var fr;
var particles = [];
var flowfield;

function preload() {
  // The model is being loaded from the cloud (Google server somewhere)
  // Images processed through model happens on computer
  bodyPose = ml5.bodyPose("MoveNet", {flipped:true});
}

function gotPoses(results) {
  poses = results;
}

function mousePressed() {
  // can see each component of the poses object
  console.log(poses);
}

function setup() {
  createCanvas(640, 480);
  //background(51);
  video = createCapture(VIDEO);
  video.hide();
  
  // .detect looks at one image one time
  // .detectStart continuously detects
  // callback function for anytime it has recieved a result from the model
  bodyPose.detectStart(video, gotPoses);

  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);

  for (var i = 0; i < 300; i ++) {
    particles[i] = new Particle();
  }
  background(51);
}

function draw() {
  //image(video, 0, 0);

  // Flip the video feed horizontally
  //push();
  //translate(width, 0); // move to the right edge
  //scale(-1, 1);         // flip horizontally
  //image(video, 0, 0, width, height);
  //pop();

  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
      stroke(0, 50);
      // push();
      // translate(x * scl, y * scl);
      // rotate(v.heading());
      // strokeWeight(1);
      // line(0, 0, scl, 0);
      // pop();
    }
    yoff += inc;

    zoff += 0.0003;
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }

  if(poses.length > 0) {
    let pose = poses[0];
    let nose_x = pose.nose.x;
    let nose_y = pose.nose.y;

    lerpedX = lerp(lerpedX, nose_x, 0.3);
    lerpedY = lerp(lerpedY, nose_y, 0.3);

    fill(255, 0, 0);
    circle(lerpedX, lerpedY, 20);
  }
}