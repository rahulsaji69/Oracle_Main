// Using Node.js Random Forest implementation instead of TensorFlow
const { RandomForestRegression } = require('ml-random-forest');
const mongoose = require('mongoose');
const Booking = require('../Models/Bookings');
const Ship = require('../Models/Ship');

/**
 * Creates and trains a Random Forest model for emissions prediction
 * @returns {Promise<RandomForestRegression>} Trained model
 */
async function createAndTrainModel() {
  try {
    console.log('Training CO2 emissions prediction model...');
    
    // Get historical data from completed bookings and ships
    const bookings = await Booking.find({
      'carbonEmissions.actualEmissions': { $exists: true, $ne: null }
    }).populate('assignedShip');
    
    if (bookings.length < 10) {
      console.log('Not enough historical data for model training. Using default estimations.');
      return null;
    }
    
    // Extract features and target values
    const trainingData = [];
    const targetValues = [];
    
    bookings.forEach(booking => {
      if (!booking.assignedShip) return;
      
      const features = extractFeatures(booking, booking.assignedShip);
      trainingData.push(features);
      targetValues.push(booking.carbonEmissions.actualEmissions);
    });
    
    // Configure and train Random Forest model
    const options = {
      nEstimators: 100,
      maxFeatures: 0.8,
      replacement: true,
      seed: 42,
      treeOptions: {
        maxDepth: 10,
        minNumSamples: 2
      }
    };
    
    const model = new RandomForestRegression(options);
    model.train(trainingData, targetValues);
    
    console.log('CO2 emissions prediction model trained successfully');
    return model;
  } catch (error) {
    console.error('Error training emissions model:', error);
    return null;
  }
}

/**
 * Extract feature array from booking and ship data
 */
function extractFeatures(booking, ship) {
  return [
    // Route features
    booking.cargoWeight || 0,
    booking.cargoQuantity || 0,
    getPortDistance(booking.originPort, booking.destinationPort),
    
    // Ship features
    getEmissionClassValue(ship),
    getFuelTypeValue(ship),
    ship.fuelEfficiency || getDefaultFuelEfficiency(ship.shipType),
    ship.greenTechnologyEquipped?.length || 0,
    ship.cargoCapacity || 0,
    
    // Cargo features
    getCargoDensity(booking),
    getCargoTypeValue(booking.cargoType),
    booking.isHazardous ? 1 : 0,
    booking.requiresRefrigeration ? 1 : 0
  ];
}

/**
 * Calculate estimated CO2 emissions for a booking and potential ships
 * @param {Object} booking - The booking object
 * @param {Array} potentialShips - Array of ship objects to consider
 * @returns {Promise<Array>} Ships with predicted emissions
 */
async function predictEmissionsForShips(booking, potentialShips) {
  try {
    const model = await getOrCreateModel();
    
    // If no model is available, fall back to basic estimation
    if (!model) {
      return potentialShips.map(ship => ({
        ...ship.toObject(),
        predictedEmissions: basicEmissionEstimate(booking, ship),
        confidence: 0.7
      }));
    }
    
    // Predict with model for each ship
    return potentialShips.map(ship => {
      const features = extractFeatures(booking, ship);
      
      // Get prediction and confidence
      const predictedValue = model.predict([features])[0];
      const confidence = calculateConfidence(model, features);
      
      return {
        ...ship.toObject(),
        predictedEmissions: predictedValue,
        confidence: confidence
      };
    });
    
  } catch (error) {
    console.error('Error predicting emissions:', error);
    return potentialShips.map(ship => ({
      ...ship.toObject(),
      predictedEmissions: basicEmissionEstimate(booking, ship),
      confidence: 0.6
    }));
  }
}

/**
 * Basic emission estimation when ML model is not available
 */
function basicEmissionEstimate(booking, ship) {
  const distance = getPortDistance(booking.originPort, booking.destinationPort);
  const weight = booking.cargoWeight;
  
  // Default emissions factors by ship type (kg CO2 per ton-mile)
  const emissionFactors = {
    'Container': 0.0213,
    'Bulk Carrier': 0.0078,
    'Tanker': 0.0089,
    'RoRo': 0.0376,
    'Passenger': 0.1152,
    'default': 0.0150
  };
  
  const factor = emissionFactors[ship.shipType] || emissionFactors.default;
  
  // Apply modifiers for ship efficiency and technology
  let efficiency = 1.0;
  
  // Emission class modifier (1-5, where 1 is most efficient)
  if (ship.emissionClass) {
    efficiency *= (1 + (ship.emissionClass - 3) * 0.1);
  }
  
  // Green technology modifier
  if (ship.greenTechnologyEquipped && ship.greenTechnologyEquipped.length > 0) {
    efficiency *= (1 - (ship.greenTechnologyEquipped.length * 0.05));
  }
  
  return weight * distance * factor * efficiency;
}

/**
 * Get or create the emissions prediction model
 */
let cachedModel = null;
let modelLastUpdated = null;

async function getOrCreateModel() {
  // Refresh model every 24 hours or if not available
  const shouldRefreshModel = 
    !cachedModel || 
    !modelLastUpdated || 
    (Date.now() - modelLastUpdated > 24 * 60 * 60 * 1000);
  
  if (shouldRefreshModel) {
    cachedModel = await createAndTrainModel();
    modelLastUpdated = Date.now();
  }
  
  return cachedModel;
}

/**
 * Calculate prediction confidence based on model variance
 */
function calculateConfidence(model, features) {
  // Get predictions from all trees to calculate variance
  const predictions = model.predictionValues([features])[0];
  
  if (!predictions || predictions.length < 2) {
    return 0.7; // Default confidence
  }
  
  // Calculate standard deviation
  const mean = predictions.reduce((sum, val) => sum + val, 0) / predictions.length;
  const squaredDiffs = predictions.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / predictions.length;
  const stdDev = Math.sqrt(variance);
  
  // Convert std dev to confidence score (0.5-1.0)
  // Lower std dev = higher confidence
  const normalizedStdDev = Math.min(stdDev / mean, 0.5);
  return 1.0 - normalizedStdDev;
}

/**
 * Helper functions for feature extraction
 */
function getPortDistance(originPort, destinationPort) {
  // In a real implementation, this would look up the distance from a database
  // For now, return a simple estimated distance
  const portDistances = {
    'SGSIN-NLRTM': 8262, // Singapore to Rotterdam
    'CNSHA-USNYC': 11897, // Shanghai to New York
    'KRPUS-JPTYO': 590, // Busan to Tokyo
    'DEHAM-GBLON': 433, // Hamburg to London
    'USLA1-USSEA': 1127, // Los Angeles to Seattle
    'default': 5000 // Default distance
  };
  
  const key = `${originPort}-${destinationPort}`;
  const reverseKey = `${destinationPort}-${originPort}`;
  
  return portDistances[key] || portDistances[reverseKey] || portDistances.default;
}

function getEmissionClassValue(ship) {
  return ship.emissionClass || 3;
}

function getFuelTypeValue(ship) {
  const fuelTypeValues = {
    'Heavy Fuel Oil': 1,
    'Marine Diesel Oil': 2,
    'Liquefied Natural Gas': 3,
    'Biofuel': 4,
    'Hybrid': 5
  };
  
  return fuelTypeValues[ship.fuelType] || 2;
}

function getDefaultFuelEfficiency(shipType) {
  const defaults = {
    'Container': 35,
    'Bulk Carrier': 25,
    'Tanker': 30,
    'RoRo': 40,
    'Passenger': 60,
    'default': 35
  };
  
  return defaults[shipType] || defaults.default;
}

function getCargoDensity(booking) {
  if (!booking.cargoWeight || !booking.cargoDimensions) return 1.0;
  
  const volume = booking.cargoDimensions.length * 
    booking.cargoDimensions.width * 
    booking.cargoDimensions.height * booking.cargoQuantity;
    
  return volume > 0 ? booking.cargoWeight / volume : 1.0;
}

function getCargoTypeValue(cargoType) {
  const cargoTypeValues = {
    'General': 1,
    'Containers': 2,
    'Bulk': 3,
    'Liquid': 4,
    'Vehicles': 5,
    'Refrigerated': 6,
    'Hazardous': 7
  };
  
  return cargoTypeValues[cargoType] || 1;
}

module.exports = {
  predictEmissionsForShips,
  getOrCreateModel,
  basicEmissionEstimate
}; 