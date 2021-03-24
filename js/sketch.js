/*
 * This is a fantastic video: https://www.youtube.com/watch?v=DZfv0YgLJ2Q
  * */

const tileSize = 100;

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(100);
  showGrid();
}

function showGrid() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 == 0) {
        fill(0);
      } else {
        fill(255);
      }

      rect(i*tileSize, j*tileSize, tileSize, tileSize);
    }
  }
}

