let p;
let a;
let data = [];
let reset = false;
let scoreA = 0;
let scoreB = 0;
let gamePool = [];
let r = false;
let safeA;

function setup(){
  createCanvas(300, 150);
  p = new player();
  a = new ai();
  // for(let i = 0; i < 10; i++){
  //   gamePool.push(new game());
  // }
}

function draw(){
  background(100);
  text(scoreA.toString() + " vs " + scoreB.toString(), 10, 10);
  a.run(p);
  a.show();
  scoreA += a.updateBullets(p);

  p.show();
  scoreB += p.updateBullets(a);

  if(reset){
    //Reset both players
    a.reset();
    p.reset();
    //After taking care of the match, he falls for the trick himself. You reset like a hero.
    reset = false;
    //train?? may god be with me that this goes well first try.
    for(let i = 0; i < data.length; i++){
      a.train(data[i][0], data[i][1]);
    }
    // for(let i = 0; i < 1; i++){
    //   gamePool.push(new game(a, a));
    // }
    //a = safeA.copy();
    //data = [];
  }

  //Loop through all the games and update them
  if(gamePool[0] != undefined){
    for(let i = 0; i < gamePool.length; i++){
      if(gamePool[i] instanceof game){
        //Update the fitness functions!
        let aa = gamePool[i].update();
        if(aa != null) gamePool[i] = aa;
      }
    }
    //Check if all the games have finished.
    r = true;
    let tot = 0;
    let tots = 0;
    for(let i = 0; i < gamePool.length; i++){
      if(gamePool[i] instanceof game){
        r = false;
        break;
      }
      if(tot <= gamePool[i].f){
        console.log(gamePool[i].f);
        tot = gamePool[i].f;
        tots = i;
      }
    }

    if(r){
      //create new parents for every match
      let parents = [];
      for(let i = 0; i < gamePool.length; i++){
        let par = [];
        let rand = random(gamePool.length);
        if(random(tot) < gamePool[rand]) par.push(gamePool[rand]);
        rand = random(gamePool.length);
        if(random(tot) < gamePool[rand]) par.push(gamePool[rand]);
        parents.push(par)
      }

      safeA = gamePool[tots].copy(width);
      for(let i = 0; i < gamePool.length; i++){
        gamePool[i] = new game(parents[i][0], parents[i][1]);
      }

      delete parents;
    }
  }
}

function keyPressed(){
  if(keyCode == UP_ARROW){
    getData(0);
    p.moveUp();
  }
  if(keyCode == DOWN_ARROW){
    getData(1);
    p.moveDown();
  }
  if(keyCode == RIGHT_ARROW){
    getData(2);
    p.shoot();
  }
  if(keyCode == LEFT_ARROW){
    //Making sure we dont start training with a retarded network to save ourselfs some time.
    gamePool.push(new game(a, a));
  }
}


function getData(x){
  //Construct the pre data.
  let pre = [];

  if(p.y > a.y){
    pre.push(1);
  } else {
    pre.push(0);
  }

  if(p.y < a.y){
    pre.push(1);
  } else {
    pre.push(0);
  }

  if(a.bullets.length != 0){
    if(a.bullets[0].y >= p.y){ pre.push(1); } else { pre.push(0); }
    if(a.bullets[0].y <= p.y){ pre.push(1); } else { pre.push(0); }
  } else {
    pre.push(0);
    pre.push(0);
  }

  if(p.y == height/10){
    pre.push(1);
  } else {
    pre.push(0);
  }

  if(p.y == height - height/10){
    pre.push(1);
  } else {
    pre.push(0);
  }

  //Construct a label
  let label = new Array(3).fill(0);
  label[x] = 1;

  //Add preData and label in Array(2). Add to data.
  let all = [];
  all.push(pre);
  all.push(label);
  data.push(all);
}

//Basically the loop we use to implement neuroEvolution.
//TODO when to start with what network
