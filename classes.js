class player {
  constructor(){
    this.x = 0;
    this.y = height/2;
    this.bullets = [];
  }

  show(){
    rectMode(CENTER); // Set rectMode to CENTER
    rect(this.x, this.y, 15, 15);
  }

  updateBullets(e){
    //Update all the bullets
    for(let i = 0; i < this.bullets.length; i++){
      if(this.bullets[i].x > width){
        if(this.bullets[i].y == e.y){ reset = true; return 1; }
        if(this.bullets[i].y != e.y) this.bullets.pop();
      } else{
        this.bullets[i].update(this);
      }
    }
    return 0;
  }

  shoot(){
    if(this.bullets.length == 0)  this.bullets.push(new bullet(this.x, this.y, 1));
  }

  moveUp(){
    if(this.y > height/10) this.y -= height/10;
  }

  moveDown(){
    if(this.y < height -height/10) this.y += height/10;
  }

  reset(){
    this.x = 0;
    this.y = height/2;
    this.bullets = [];
  }
}

class bullet {
  constructor(x, y, p){
    this.x = x;
    this.y = y;
    this.speed = 5 * p;
  }

  update(e){
    this.x += this.speed;
    if(e instanceof player) this.draw();
  }

  draw(){
    ellipse(this.x, this.y, 10, 10);
  }

}

class ai {
  constructor(x = width, dir = 1){
    this.x = x;
    this.y = height/2;
    this.dir = dir;
    this.brain = new neuralNetwork([6, 20, 10, 3], 0.1);
    this.bullets = new Array();
    this.f = 0;
    this.Fshot = null;
    this.mov = [];
  }

  //Make new AI, copy brain and shoot it the fuck back.
  copy(x = width, dir = 1){
    let result = new ai(x, dir)
    result.brain = neuralNetwork.evolve(this.brain);
    return result;
  }

  run(e){
    //console.log("collecting data")
    let data = [];

    if(this.y > e.y){
      data.push(1);
    } else {
      data.push(0);
    }

    if(this.y < e.y){
      data.push(1);
    } else {
      data.push(0);
    }

    if(e.bullets.length != 0){
      if(e.bullets[0].y >= this.y){ data.push(1); } else { data.push(0); }
      if(e.bullets[0].y <= this.y){ data.push(1); } else { data.push(0); }
    } else {
      data.push(0);
      data.push(0);
    }

    if(this.y == height/10) {
      data.push(1);
    } else {
      data.push(0);
    }

    if(this.y == height - height/10){
      data.push(1);
    } else {
      data.push(0);
    }

    let result = this.brain.run(data);

    //Safe the move for further processing
    this.mov.push(result.indexOf(Math.max.apply(window, result)));

    aiFunctions[result.indexOf(Math.max.apply(window, result))](this);

  }

  train(input, output){
    this.brain.train(input, output);
  }

  reset(){
    this.x = width;
    this.y = height/2;
    this.bullets = new Array();
  }

  updateBullets(e){
    //Check the movements
    if(this.checkMovements()){
      this.f = 0;
      this.Fshot = 0;
      console.log("terminating");
      return 1;
    }

    //Update all the bullets
    for(let i = 0; i < this.bullets.length; i++){
      if(this.bullets[i].x < 0){
        if(this.bullets[i].y == e.y){
         if(e instanceof player) reset = true;
         this.f += (height/10) * (height/10);
         return 1;
       } else {
         this.Fshot = ((height/10) / (this.bullets[i].y - e.y)) * ((height/10) / (this.bullets[i].y - e.y))
       }
        if(this.bullets[i].y != e.y) this.bullets.pop();
      } else{
        this.bullets[i].update(e);
      }
    }
    return 0;
  }

  //We dont want a network which is spamming up or down all the time. Kill them.
  //We do not want to check every loop. Only if there are 20 moves.
  checkMovements(){
    if(this.mov.length == 20){
      let check = this.mov[0];
      for(let i = 0; i < this.mov.length; i++){
        if(this.mov[i] != check) return 0;
      }
      return 1; //TERMINATEEE
    }
    return 0;
  }

  show(){
    rectMode(CENTER); // Set rectMode to CENTER
    rect(this.x, this.y, 15, 15);
  }
}

let aiFunctions = [
  function(a) {
    //move up
    if(a.y > height/10) a.y -= height/10;
  },

  function(a) {
    //Move down
    if(a.y < height - height/10) a.y += height/10;
  },

  function(a) {
    //shoot
    if(a.bullets.length == 0) a.bullets.push(new bullet(a.x, a.y, -1 * a.dir));
  }
];
