//global variables
let cols = 10;
let rows = 10;
let scl = 50;
let grid = [];
let stack = [];
var player_sprite_sheet;
var bad_guy_sprite_sheet;
var walk_forward, walk_right, walk_left, walk_back;
var finish_line;
var level = 1;
var levelFinished = false;
var mazeFont;
var mainMenu = true;
var instructions = false;
var gameComplete = false;
var gameOver = false;
var multiplayer = false;

function preload() {
  mazeFont = loadFont('assets/smbfont.ttf');

 loadJSON('assets/json/player_front_frames.json', function (player_front_frames) {
  player_sprite_sheet = loadSpriteSheet('assets/character.png', player_front_frames);
  walk_forward = loadAnimation(player_sprite_sheet);
  walk_forward.frameDelay = 7;
});

  loadJSON('assets/json/player_right_frames.json', function (player_right_frames) {
		player_sprite_sheet = loadSpriteSheet('assets/character.png', player_right_frames);
    walk_right = loadAnimation(player_sprite_sheet);
    walk_right.frameDelay = 7;
	});

  loadJSON('assets/json/player_left_frames.json', function (player_left_frames) {
		player_sprite_sheet = loadSpriteSheet('assets/character.png', player_left_frames);
    walk_left = loadAnimation(player_sprite_sheet);
    walk_left.frameDelay = 7;
	});

  loadJSON('assets/json/player_back_frames.json', function (player_back_frames) {
		player_sprite_sheet = loadSpriteSheet('assets/character.png', player_back_frames);
    walk_back = loadAnimation(player_sprite_sheet);
    walk_back.frameDelay = 7;
	});

  loadJSON('assets/json/door_frames.json', function (door_frames) {
		door_sprite_sheet = loadSpriteSheet('assets/animatedcastledoors.png', door_frames);
    open_door = loadAnimation(door_sprite_sheet);
    open_door.frameDelay = 10;
	});

  key_sprite_frame = loadAnimation(
    new SpriteSheet('assets/items.png', [{
      name: 'key',
      'frame': {
        'x': 52,
        'y': 52,
        'width': 16,
        'height': 16
      }
    }])
  );

  loadJSON('assets/json/bad_guy_front_frames.json', function (bad_guy_front_frames) {
		bad_guy_sprite_sheet = loadSpriteSheet('assets/zombie_n_skeleton2.png', bad_guy_front_frames);
    bad_walk_forward = loadAnimation(bad_guy_sprite_sheet);
    bad_walk_forward.frameDelay = 7;
	});

  loadJSON('assets/json/bad_guy_left_frames.json', function (bad_guy_left_frames) {
		bad_guy_sprite_sheet = loadSpriteSheet('assets/zombie_n_skeleton2.png', bad_guy_left_frames);
    bad_walk_left = loadAnimation(bad_guy_sprite_sheet);
    bad_walk_left.frameDelay = 7;
	});

  loadJSON('assets/json/bad_guy_right_frames.json', function (bad_guy_right_frames) {
    bad_guy_sprite_sheet = loadSpriteSheet('assets/zombie_n_skeleton2.png', bad_guy_right_frames);
    bad_walk_right = loadAnimation(bad_guy_sprite_sheet);
    bad_walk_right.frameDelay = 7;
	});

  loadJSON('assets/json/bad_guy_back_frames.json', function (bad_guy_back_frames) {
    bad_guy_sprite_sheet = loadSpriteSheet('assets/zombie_n_skeleton2.png', bad_guy_back_frames);
    bad_walk_back = loadAnimation(bad_guy_sprite_sheet);
    bad_walk_back.frameDelay = 7;
	});

}
function setup() {
  mazewalls = new Group();
  createCanvas(cols * scl, rows * scl);
}
function draw() {
  background(100);
  if (mainMenu) {
    menu_screen();
  } else if (instructions) {
    instruction_screen();
  }
  else if( gameOver){
    game_over_screen();
  } 
  else if (gameComplete){
    game_finish_screen();
  }
  else {
    drawSprites();
    move();
    spriteInteractions();
  }

}

function move() {
  if (keyDown(RIGHT_ARROW)) {
    player_sprite.setSpeed(2, 0);
    player_sprite.changeAnimation('right');
    player_sprite.animation.play();
  }
  if (keyDown(LEFT_ARROW)) {
    player_sprite.setSpeed(2, 180);
    player_sprite.changeAnimation('left');
    player_sprite.animation.play();
  }
  if (keyDown(UP_ARROW)) {
    player_sprite.setSpeed(2, 270);
    player_sprite.changeAnimation('back');
    player_sprite.animation.play();
  }
  if (keyDown(DOWN_ARROW)) {
    player_sprite.setSpeed(2, 90);
    player_sprite.changeAnimation('forward');
    player_sprite.animation.play();
  }
  if (keyDown(' ')) {
    player_sprite.setSpeed(0, 0);
    player_sprite.animation.stop();
  }
  if (multiplayer) {
  if (keyDown('D')) {
    controlledZombie.setSpeed(2, 0);
    controlledZombie.changeAnimation('bad right');
    controlledZombie.animation.play();
  }
  if (keyDown('A')) {
    controlledZombie.setSpeed(2, 180);
    controlledZombie.changeAnimation('bad left');
    controlledZombie.animation.play();
  }
  if (keyDown('W')) {
    controlledZombie.setSpeed(2, 270);
    controlledZombie.changeAnimation('bad back');
    controlledZombie.animation.play();
  }
  if (keyDown('S')) {
    controlledZombie.setSpeed(2, 90);
    controlledZombie.changeAnimation('bad forward');
    controlledZombie.animation.play();
  }
}
}

function newSprites() {
  zombies = new Group();
  createPlayer();
  createZombies();
  createExit();
  collectibles = new Group();
  createKeys();
}

function createKeys() {
  //increase keys per level
  for (let i = 0; i < level; i++) {
    var x = Math.floor(Math.random() * width) + 1;
    var y = Math.floor(Math.random() * height) + 1;
    while (x == player_start.pos.x && y == player_start.pos.y) {
      var x = Math.floor(Math.random() * width) + 1;
      var y = Math.floor(Math.random() * height) + 1;
    }
    key_sprite = createSprite(x, y);
    key_sprite.addAnimation('key_sprite_frame', key_sprite_frame);
    key_sprite.collide(mazewalls);
    collectibles.add(key_sprite);
  }
}

function createPlayer() {
  player_start = random(grid);
  player_sprite = createSprite(player_start.pos.x + player_start.size / 2, player_start.pos.y + player_start.size / 2);
  player_sprite.scale = 0.445;
  player_sprite.addAnimation('forward', walk_forward);
  player_sprite.addAnimation('right', walk_right);
  player_sprite.addAnimation('left', walk_left);
  player_sprite.addAnimation('back', walk_back);
  player_sprite.changeAnimation('forward');
  player_sprite.speed = 0.5;
}

function createSingleZombie(){
  var x = Math.floor(Math.random() * width) + 1;
  var y = Math.floor(Math.random() * height) + 1;
  while (x == player_start.pos.x && y == player_start.pos.y) {
    var x = Math.floor(Math.random() * width) + 1;
    var y = Math.floor(Math.random() * height) + 1;
  }
  zombie = createSprite(x,y);
  zombie.scale = 0.65;
  zombie.addAnimation('bad forward', bad_walk_forward);
  zombie.addAnimation('bad right', bad_walk_right);
  zombie.addAnimation('bad left', bad_walk_left);
  zombie.addAnimation('bad back', bad_walk_back);
  zombie.changeAnimation('bad forward');
  zombie.speed = 0.5;
  zombie.setSpeed(2, 90);
  return zombie;
}

function createZombies() {
  controlledZombie = createSingleZombie();
  for (let i = 1; i < level; i++) {
  autoZombie = createSingleZombie();
  zombies.add(autoZombie);
}
if (!multiplayer) {
  zombies.add(controlledZombie);
}
}

function createExit() {
  end = random(grid);
  door_sprite = createSprite(end.pos.x + current.size / 2, end.pos.y + current.size / 2);
  door_sprite.addAnimation('open', open_door);
  door_sprite.setCollider('circle', 0, 0, 1);
  door_sprite.scale = 0.5;
}

function newMaze() {
  //draw maze in sprite walls using cell class
  grid = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let c = new cell(i * scl, j * scl, i, j, scl);
      grid.push(c);
    }
  }
  current = random(grid);
  while (!finished()) {
    generateMaze();
  }
  //create bottom wall for entire canvas
  var bottomline = createSprite(cols * scl / 2, rows * scl, cols * scl, 5);
  bottomline.setCollider('rectangle');
  bottomline.shapeColor = color(200, 200, 200);
  //add walls to group for collisions
  mazewalls.add(bottomline);
  for (let cell of grid) {
    cell.drawWalls();
    for (let wall of cell.cellwalls) {
      mazewalls.add(wall);
    }
  }

}

function spriteInteractions() {
  player_sprite.overlap(collectibles, collect);
  player_sprite.collide(mazewalls);
  //only allow next level screen if all keys have been collected
  if (collectibles.length == 0) {
    player_sprite.collide(door_sprite, finish_screen);
  }
  //zombies move by themselves unless multiplayer mode, when one zombie can be controlled using wasd
  zombies.collide(mazewalls,turn);
  if(multiplayer) {
    controlledZombie.collide(mazewalls);
    controlledZombie.collide(player_sprite, game_over_screen);
  }
  zombies.collide(player_sprite, game_over_screen);
}

//screens
function finish_screen() {
  levelFinished = true;
  background("darkgrey")
  textFont(mazeFont)
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0);
  strokeWeight(10);
  textSize(80);
  text('LEVEL PASS', width/2, height/2-125)
  strokeWeight(8);
  textSize(35);
  text('BOB LIVES TO DIE ANOTHER DAY', width/2, height/2)
  rectMode(CENTER);
  fill(255);
  strokeWeight(5);
  rect(width/2, height/2+177, 100, 50); 
  strokeWeight(5);
  textSize(35);
  text('NEXT', width/2, height/2+177)
}

function game_finish_screen() {
  background("darkgrey")
  textFont(mazeFont)
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0);
  strokeWeight(10);
  textSize(80);
  text('GAME FINISH', width/2, height/2-125)
  strokeWeight(8);
  textSize(35);
  text('BOB HAS ESCAPED', width/2, height/2)
  rectMode(CENTER);
  fill(255);
  strokeWeight(5);
  rect(width/2, height/2+177, 100, 50); 
  strokeWeight(5);
  textSize(35);
  text('MAIN MENU', width/2, height/2+177)
}

function game_over_screen(){
  gameOver = true;
  clearSprites();
  background("darkgrey")
  textFont(mazeFont)
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0);
  strokeWeight(10);
  textSize(80);
  text('GAME OVER', width/2, height/2-125)
  strokeWeight(8);
  textSize(40);
  text('RIP BOB.', width/2, height/2)
  rectMode(CENTER);
  fill(255);
  strokeWeight(5);
  rect(width/2, height/2+177, 150, 50); 
  strokeWeight(5);
  textSize(35);
  text('MAIN MENU', width/2, height/2+177)
}

function menu_screen() {
  background('darkgrey');
  textFont(mazeFont);
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0);
  strokeWeight(10);
  textSize(90);
  text('THE MAZE OF DOOM', width / 2, height / 2 - 150);
  textSize(35);
  text('By VIVEK BARAPATRE', width / 2, height / 2 - 80);
  rectMode(CENTER);
  fill(255);
  strokeWeight(5);
  rect(width / 2, height / 2, 200, 50);
  strokeWeight(5);
  textSize(35);
  text('HOW TO PLAY', width / 2, height / 2 - 1);
  rect(width / 2, height / 2 + 80, 200, 50);
  strokeWeight(5);
  textSize(35);
  text('START GAME', width / 2, height / 2 + 81);
  rect(width / 2, height / 2 + 160, 200, 50);
  strokeWeight(5);
  textSize(35);
  text('MULTIPLAYER', width / 2, height / 2 + 160);
}

function instruction_screen() {
  background("darkgrey")
  textFont(mazeFont)
  textAlign(CENTER, CENTER);
  fill(255);
  stroke(0);
  strokeWeight(5);
  textSize(30);
  text('BOB IS ONE OF THE LAST SURVIVING HUMANS IN', width / 2, height / 2 - 200)
  text('A ZOMBIE APOCALYPSE', width / 2, height / 2 - 150)
  text('USE ARROW KEYS TO HELP NAVIGATE BOB OUT OF THE MAZE', width / 2, height / 2-40)
  text('COLLECT KEYS TO UNLOCK DOOR', width / 2, height / 2 + 10)
  text('AVOID ZOMBIES AT ALL COST', width / 2, height / 2 + 60)
  text('CONTROL A ZOMBIE USING WASD KEYS IN MULTIPLAYER', width / 2, height / 2 + 110)
  strokeWeight(5.5);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 180, 100, 50);
  textSize(35);
  text('BACK', width / 2, height / 2 + 177)
}

function mousePressed() {
  //change screens depending on which screen is displayed and which button is clicked
  if (levelFinished) {
    level = level + 1;
    levelFinished = false;
    if (level < 5) {
      clearSprites();
      newMaze();
      newSprites();
      spriteInteractions();
    } else {
      clearSprites();
      gameComplete = true;
    }
  } else if (mainMenu) {
    if (mouseX > (width / 2) - 100 && mouseX < (width / 2) + 100 &&
      mouseY > height / 2 - 25 && mouseY < (width / 2) + 25) {
      instructions = true;
      mainMenu = false;
    } else if (mouseX > (width / 2) - 100 && mouseX < (width / 2) + 100 &&
      mouseY > 304 && mouseY < 355) {
      instructions = false;
      mainMenu = false;
      multiplayer = false;
      newMaze();
      newSprites();
    } else if (mouseX > (width / 2) - 100 && mouseX < (width / 2) + 100
    && mouseY > height / 2 - 25 + 160 && mouseY < (width / 2) + 25 + 160) {
          multiplayer = true;
          instructions = false;
          mainMenu = false;
          newMaze();
          newSprites();
    }

  } else if (instructions) {
    if (mouseX > (width / 2 - 50) && mouseX < (width / 2) + 50 &&
      mouseY > height / 2 + 180 - 25 && mouseY < (width / 2) + 180 + 25) {
      instructions = false;
      mainMenu = true;
    }
  } else if (gameOver) {
    clearSprites();
    level = 1;
    mainMenu = true;
    instructions = false;
    gameComplete = false;
    gameOver = false;
    multiplayer = false;
  } else if (gameComplete) {
    clearSprites();
    level = 1;
    mainMenu = true;
    instructions = false;
    gameComplete = false;
    gameOver = false;
    multiplayer = false;
  }
}

function clearSprites() {
  for (let i = allSprites.length; i--;) {
    allSprites[i].remove();
  }
}

//remove keys once bob has overlapped 
function collect(collector, collected) {
  collected.remove();
}

//basic auto walk algorithm for zombies 
function turn(collector, collected) {
  //select a random number between 1 and 4
  var random = Math.floor(Math.random() * (4 - 1 + 1) + 1);
  //use randomly generated number to decide which direction zombie walks in after colliding with wall 
  if (random == 1) {
    collector.changeAnimation('bad forward');
    collector.animation.play();
    collector.setSpeed(2, 0);
  } else if (random == 2) {
    collector.changeAnimation('bad left');
    collector.animation.play();
    collector.setSpeed(2, 90);
  } else if (random == 3) {
    collector.changeAnimation('bad back');
    collector.animation.play();
    collector.setSpeed(2, 180);
  } else if (random == 4) {
    collector.changeAnimation('bad right');
    collector.animation.play();
    collector.setSpeed(2, 270);
  }

}

//maze generating algorithm methods below 
function generateMaze() {
  current.visited = true;
  let next = current.checkNeighbors();
  if (next !== undefined) {
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

function finished() {
  for (let cell of grid) {
    if (!cell.visited) {
      return false
    }
  }
  return true;
}

function removeWalls(a, b) {

  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
