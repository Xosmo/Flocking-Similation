window.onload = function() {

  var canvas = document.querySelector('canvas');
  var c = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  //////////////////////////////////////////
  //////////////////////////////////////////
  //////////////////////////////////////////

  class Boid {
    constructor() {
      this.radius = 5;
      // this.color = randomColor(colors);
      this.color = 'white';
      this.acceleration = new Victor(0,0);
      this.position = new Victor(randomIntFromRange(this.radius,canvas.width-this.radius),randomIntFromRange(this.radius,canvas.height-this.radius));
    	this.velocity = new Victor(randomX(),randomY());
      this.maxSpeed = 3;
      this.maxForce = 0.05;
    }

    update() {
      this.edge();
    	this.velocity.add(this.acceleration);
      limit(this.velocity,this.maxSpeed);
      this.position.add(this.velocity);
      this.acceleration.multiply(new Victor(0,0));
    }

    draw() {
      c.fillStyle = this.color;
      c.beginPath();
      c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      c.fill();
    }

    edge() {
      if (this.position.x < -this.radius) {
        this.position.x = window.innerWidth + this.radius;
      }
      if (this.position.x > window.innerWidth + this.radius) {
        this.position.x = -this.radius;
      }

      if (this.position.y < -this.radius) {
        this.position.y = window.innerHeight + this.radius;
      }
      if (this.position.y > window.innerHeight + this.radius) {
        this.position.y = -this.radius;
      }
    }

    separate(boids) {
      var desiredSeparation = 25;
      var steer = new Victor(0,0);
      var count = 0;
      for (var i = 0; i < boids.length; i++) {
        var d = distance(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
        if ((d > 0) && (d < desiredSeparation)) {
          var diff = new Victor().copy(this.position).subtract(boids[i].position).normalize().divide(new Victor(d,d));
          steer.add(diff);
          count++;
        }
      }
      if (count > 0) {
        steer.divide(new Victor(count,count));
      }
      if (steer.magnitude() > 0) {
        steer.normalize().multiply(new Victor(this.maxSpeed,this.maxSpeed)).subtract(this.velocity);
        limit(steer,this.maxForce);
      }
      return steer;
    }

    align(boids) {
      var neighbordist = 50;
      var sum = new Victor(0,0);
      var count =0;
      for (var i = 0; i < boids.length; i++) {
        var d = distance(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(boids[i].velocity);
          count++;
        }
      }
      if (count > 0) {
        sum.divide(new Victor(count,count)).normalize().multiply(new Victor(this.maxSpeed,this.maxSpeed));
        var steer = new Victor().copy(sum).subtract(this.velocity);
        limit(steer,this.maxForce);
        return steer;
      }
      else {
        return new Victor(0,0);
      }
    }

    cohesion(boids) {
      var neighbordist = 50;
      var sum = new Victor(0,0);
      var count = 0;
      for (var i = 0; i < boids.length; i++) {
        var d = distance(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(boids[i].position);
          count++;
        }
      }
      if (count > 0) {
        sum.divide(new Victor(count,count));
        var desired = new Victor().copy(sum).subtract(this.position).normalize().multiply(new Victor(this.maxSpeed,this.maxSpeed));
        var steer = new Victor().copy(desired).subtract(this.velocity);
        limit(steer,this.maxForce);
        return steer;
      }
      else {
        return new Victor(0,0);
      }
    }

    flock(boids) {
      var sep = this.separate(boids).multiply(new Victor(forceS,forceS));
      var ali = this.align(boids).multiply(new Victor(forceA,forceA));
      var coh = this.cohesion(boids).multiply(new Victor(forceC,forceC));

      this.acceleration.add(sep).add(ali).add(coh);
    }
  }

  function limit(vec,max) {
    var msq = vec.lengthSq();
    if (msq > max*max) {
      vec.divide(new Victor(Math.sqrt(msq),Math.sqrt(msq))).multiply(new Victor(max,max));
    }
  }
  //////////////////////////////////////////
  //////////////////////////////////////////
  //////////////////////////////////////////

  var colors = ["purple","blue","green","yellow","orange","red","white","grey"];
  var quantity = 1000;
  var forceS = 1.5;
  var forceA = 1;
  var forceC = 1;
  var boids = [];
  for (var i = 0; i < quantity; i++) {
    boids.push(new Boid());
  }
  function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < quantity; i++) {
      boids[i].flock(boids);
      boids[i].update();
      boids[i].draw();
    }
  }
  animate();

}
