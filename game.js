class game {
  constructor(a = new ai(), b = new ai()){
    this.p1 = a.copy();
    this.p2 = a.copy(0, -1);

    //Evolve brains
    this.p1.brain = neuralNetwork.evolve(this.p1.brain);
    this.p2.brain = neuralNetwork.evolve(this.p2.brain);

    this.t = 0;
    this.f = [undefined, undefined];
  }

  update(){
    // this.p1.show();
    // this.p2.show();

    this.p1.run(this.p2);
    if(this.p1.updateBullets(this.p2)){
      this.f[0] = this.p1.f + this.p1.Fshot + (100 - this.t);
      this.f[1] = this.p2.Fshot + (100 - this.t);
      if(this.f[0] > this.f[1]){
        return this.p1;
      } else {
        return this.p2;
      }
    }
    this.p2.run(this.p1);
    if(this.p2.updateBullets(this.p1)){
      this.f[1] = this.p2.f + this.p2.Fshot + (100 - this.t);
      this.f[0] = this.p1.Fshot + (100 - this.t);
      if(this.f[0] > this.f[1]){
        return this.p1;
      } else {
        return this.p2;
      }    }

    this.t++;
    if(this.t == 1000){
      this.f[0] = this.p1.Fshot + 1;
      this.f[1] = this.p1.Fshot + 1;
      if(this.f[0] > this.f[1]){
        return this.p1;
      } else {
        return this.p2;
      }
    }

    return null;
  }


  endGame(){
    return [p1.fitness, p2.fitness];
  }
}
