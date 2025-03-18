const tf = require('@tensorflow/tfjs-node');

function createModel() {
  const model = tf.sequential();

  // Input layer
  model.add(tf.layers.dense({
    units: 128,
    activation: 'relu',
    inputShape: [12] // Combined input features
  }));

  // Hidden layers with dropout for regularization
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu'
  }));

  model.add(tf.layers.dropout({
    rate: 0.3
  }));

  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu'
  }));

  model.add(tf.layers.dropout({
    rate: 0.2
  }));

  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));

  // Output layer - predicts [emissions, confidence]
  model.add(tf.layers.dense({
    units: 2,
    activation: 'linear'
  }));

  // Compile model
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['accuracy']
  });

  return model;
}

async function trainModel(model, trainingData) {
  // Prepare training data
  const inputData = trainingData.map(route => [
    // Route features
    route.origin.lat,
    route.origin.lng,
    route.destination.lat,
    route.destination.lng,
    route.distance || 0,
    
    // Ship features
    route.ship?.emissionClass || 3,
    route.ship?.fuelType || 1,
    route.ship?.greenTechnologyEquipped?.length || 0,
    
    // Cargo features
    route.cargo?.weight || 0,
    route.cargo?.quantity || 0,
    
    // Weather features
    route.weather?.windSpeed || 0,
    route.weather?.waveHeight || 0
  ]);

  const outputData = trainingData.map(route => [
    route.actualEmissions || 0,
    route.confidence || 0.8
  ]);

  // Convert to tensors
  const inputTensor = tf.tensor2d(inputData);
  const outputTensor = tf.tensor2d(outputData);

  // Train model
  await model.fit(inputTensor, outputTensor, {
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1} of 100`);
        console.log(`Loss: ${logs.loss}`);
        console.log(`Accuracy: ${logs.acc}`);
      }
    }
  });

  // Clean up tensors
  inputTensor.dispose();
  outputTensor.dispose();
}

async function predictEmissions(model, inputData) {
  try {
    // Prepare input data
    const inputTensor = tf.tensor2d([inputData]);

    // Get prediction
    const prediction = await model.predict(inputTensor);
    const result = prediction.arraySync()[0];

    // Clean up tensor
    inputTensor.dispose();
    prediction.dispose();

    return {
      estimatedEmissions: result[0],
      confidence: result[1]
    };
  } catch (error) {
    console.error('Error predicting emissions:', error);
    return null;
  }
}

module.exports = {
  createModel,
  trainModel,
  predictEmissions
}; 