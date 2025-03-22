const tf = require('@tensorflow/tfjs-node');

function createModel() {
  const model = tf.sequential();

  // Input layer
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    inputShape: [6] // [origin_lat, origin_lng, dest_lat, dest_lng, cargo_weight, cargo_quantity]
  }));

  // Hidden layers
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

  // Output layer - predicts [optimized_lat, optimized_lng, distance, time, emissions, confidence]
  model.add(tf.layers.dense({
    units: 6,
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
    route.origin.lat,
    route.origin.lng,
    route.destination.lat,
    route.destination.lng,
    route.cargo?.weight || 0,
    route.cargo?.quantity || 0
  ]);

  const outputData = trainingData.map(route => [
    route.optimizedRoute?.lat || route.destination.lat,
    route.optimizedRoute?.lng || route.destination.lng,
    route.distance || 0,
    route.time || 0,
    route.emissions || 0,
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

module.exports = {
  createModel,
  trainModel
}; 