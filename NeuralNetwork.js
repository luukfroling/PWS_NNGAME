class neuralNetwork {
  constructor(sizes, learningRate = 1){

    this.sizes = sizes;
    this.learningRate = learningRate;

    //Create layers:
    this.layers = new Array();
    for(let i = 0; i < sizes.length; i++){
      this.layers.push(new Matrix(sizes[1]));
    }
    //Create weights and biases:
    this.weights = new Array();
    this.biases = new Array();

    for(let i = 0; i < this.layers.length - 1; i++){
      this.weights.push(new Matrix(sizes[i+1],sizes[i]));
      this.biases.push(new Matrix(sizes[i+1],1));
    }
  }
  /* An activation function for the network.
  *  Go through all the layers and dot multiply. We also need to apply the sigmoid function over every element.
  */
  activate(input){
    this.layers[0] = Matrix.fromArray(input);
    for(let i = 0; i < this.weights.length; i++){
      let w = this.weights[i];
      let x = this.layers[i];
      this.layers[i+1] = Matrix.product(w, x);
      this.layers[i+1].add(this.biases[i]);
      this.layers[i+1].func(sigmoid);
    }
    this.output = this.layers[this.layers.length - 1];
  }

  run(input){
    this.activate(input);
    return Matrix.toArray(this.output);
  }
  /* A training fucntion using backpropagation.
  *  We need to loop through every layer, and we need to do the following:
  * -Transpose The weight matrix so we can dot product the matrix with the errors to get the errors of the
  * previous layer.
  * -Transpose the layer so we can dot multiply the error.
  * - Calculate the dot product of error * input so we get the change
  * - Calculate the dot product of the transposed weight * error so we get the next error.
  * - Add the calculated change to the weight matrix we are currently in.
  */
  train(input, des){
    this.activate(input);
    let error = Matrix.substract(Matrix.fromArray(des), this.output);
    for(let i = this.weights.length - 1; i > -1; i--){
      //Transpose:
      let inT = Matrix.transpose(this.layers[i]);
      let wT = Matrix.transpose(this.weights[i]);
      //Product:
      let change = Matrix.product(error, inT);
      this.biases[i].add(error);
      error = Matrix.product(wT, error);
      //Update weights:
      this.weights[i].add(Matrix.scale(change, this.learningRate));
    }
  }

  /* Visualise the network. Takes a P% graphics input.
  *  This function therefor requires the P5.js library.
  *  Returns the adjusted graphics
  */
  visualise(g){
    //Setup the nodes and loop through them
    for(let i = 0; i < this.layers.length; i++){
      let xdiv = width / (this.layers.length + 1);

      for(let j = 0; j < this.layers[i].matrix.length; j++){
        let div = (height) / (this.layers[i].matrix.length + 1);
        fill(map(this.layers[i].matrix[j][0], 0, 1, 0, 255));
        ellipse(xdiv + i * xdiv, div + j * div, 10, 10);
        fill(0);
        text(roundDecimal(this.layers[i].matrix[j][0]), 20 + xdiv + i * xdiv, div + j * div);
      }
    }
    return g;
  }

  /* Evolve neural network. Perform a mutation to see if we imporve the network.
  *  TODO add crossover. Mutate from n because we want to copy n. Luuk u are retarded.
  */

  static evolve(n){
    let result = new neuralNetwork(n.sizes);

    //Copy weights
    for(let i = 0; i < result.weights.length; i++){
      result.weights[i] = Matrix.mutate(n.weights[i], 0.25);
    }

    return result;
  }
}

function sigmoid(x) {
    return 1/(1+Math.pow(Math.E, -x));
}
