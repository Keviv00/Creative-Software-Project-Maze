class cell {

  constructor(x, y, i, j, s) {
    this.pos = createVector(x, y);
    this.i = i;
    this.j = j;
    this.previous = undefined;
    this.size = s;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.neighbors = [];
    this.cellwalls = [];
  }

  drawWalls() {
        this.top = this.walls[0];
        this.left = this.walls[3];
        this.right = this.walls[1];
        this.bottom = this.walls[2];
        let pos = this.pos;
        let size = this.size;
        if (this.top){
          var line = createSprite(pos.x+size/2, pos.y+0.5, size, 5);
          line.setCollider('rectangle', 0, 0, size+5,5+5);
          this.cellwalls.push(line);
          line.shapeColor = color(200,200,200);
        }
        if (this.left){
          var line = createSprite(pos.x, pos.y+size/2, 5, size);
          line.setCollider('rectangle', 0, 0, 5+5,size+5);
          this.cellwalls.push(line);
          line.shapeColor = color(200,200,200);
        }
        if (this.bottom){
          var line = createSprite(pos.x+size/2, pos.ysize, size, 5);
          line.setCollider('rectangle', 0, 0, size+5,5+5);
          this.cellwalls.push(line);
          line.shapeColor = color(200,200,200);
        }
        if (this.right){
          var line = createSprite(pos.x+size, pos.y+size/2, 5, size);
          line.setCollider('rectangle', 0, 0, 5+5,size+5);
          this.cellwalls.push(line);
          line.shapeColor = color(200,200,200);  
        }
  }


  //neighbor function used in maze generation
  checkNeighbors() {
    let neighbors = []

    let i = this.i;
    let j = this.j;
    let top = grid[index(i, j - 1)];
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      return random(neighbors);
    } else {
      return undefined;
    }
  }
}

//2d index into 1d array
function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}