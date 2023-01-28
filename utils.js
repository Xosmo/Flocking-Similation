function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomX(speed = 1) {
  return speed * Math.cos(2*Math.PI*Math.random());
}
function randomY(speed = 1) {
  return speed * Math.sin(2*Math.PI*Math.random());
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1
  const yDist = y2 - y1

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

function test(x=0) {
  console.log("TEST"+"  "+x);
}

//var colors = ["purple","blue","green","yellow","orange","red","white","grey"];
