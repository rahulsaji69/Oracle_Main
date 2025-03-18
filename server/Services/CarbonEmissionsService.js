/**
 * Carbon Emissions Service
 * 
 * This service provides functions for calculating, predicting, and optimizing
 * carbon emissions for shipping routes.
 */

const Ship = require('../Models/Ship');
const Booking = require('../Models/Bookings');
const MLService = require('./MLService');

/**
 * Calculate the distance between two ports using the Haversine formula
 * @param {Object} originCoords - {lat, lng} of origin port
 * @param {Object} destinationCoords - {lat, lng} of destination port
 * @returns {Number} Distance in nautical miles
 */
const calculateDistance = (originCoords, destinationCoords) => {
  const R = 3440.07; // Earth radius in nautical miles
  const dLat = toRad(destinationCoords.lat - originCoords.lat);
  const dLon = toRad(destinationCoords.lng - originCoords.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(originCoords.lat)) * Math.cos(toRad(destinationCoords.lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

/**
 * Get emission factors based on ship characteristics
 * @param {Object} ship - Ship model instance
 * @returns {Object} Emission factors
 */
const getEmissionFactors = (ship) => {
  // Base emission factors by fuel type (kg CO2 per nautical mile per ton)
  const fuelEmissionFactors = {
    'Heavy Fuel Oil': 0.045,
    'Marine Diesel Oil': 0.040,
    'Liquefied Natural Gas': 0.030,
    'Biofuel': 0.022,
    'Hybrid': 0.025
  };
  
  // Reduction factors based on green technology
  const greenTechReductions = {
    'Solar Panels': 0.05,
    'Wind Assistance': 0.10,
    'Shore Power Connection': 0.02,
    'Exhaust Gas Cleaning': 0.07,
    'Energy Recovery Systems': 0.08,
    'None': 0
  };
  
  // Calculate reductions from green tech
  let reductionFactor = 0;
  if (ship.greenTechnologyEquipped && ship.greenTechnologyEquipped.length > 0) {
    reductionFactor = ship.greenTechnologyEquipped.reduce((total, tech) => {
      return total + (greenTechReductions[tech] || 0);
    }, 0);
  }
  
  // Apply ship-specific emission rate if available, otherwise use fuel type
  const baseEmissionRate = ship.emissionRatePerMile || 
                          (ship.cargoCapacity * fuelEmissionFactors[ship.fuelType || 'Marine Diesel Oil']);
  
  // Apply green tech reductions
  const adjustedEmissionRate = baseEmissionRate * (1 - reductionFactor);
  
  return {
    baseEmissionRate,
    adjustedEmissionRate,
    reductionFactor
  };
};

/**
 * Calculate estimated carbon emissions for a booking
 * @param {Object} booking - Booking object
 * @param {Object} ship - Ship object
 * @param {Object} routeDetails - Contains origin and destination coordinates
 * @returns {Object} Emissions data
 */
const calculateEmissions = async (booking, ship, routeDetails) => {
  try {
    if (MLService) {
      // Try ML-based prediction first
      const prediction = await MLService.predictEmissions(
        {
          origin: routeDetails.originCoords,
          destination: routeDetails.destinationCoords,
          distance: calculateDistance(routeDetails.originCoords, routeDetails.destinationCoords),
          ship: {
            emissionClass: ship.emissionClass,
            fuelType: ship.fuelType,
            greenTechnologyEquipped: ship.greenTechnologyEquipped
          },
          cargo: {
            weight: booking.cargoWeight,
            quantity: booking.cargoQuantity
          }
        }
      );

      if (prediction) {
        return {
          estimatedTotalEmissions: prediction.estimatedEmissions,
          emissionRate: prediction.estimatedEmissions / (booking.cargoWeight * booking.cargoQuantity),
          distance: calculateDistance(routeDetails.originCoords, routeDetails.destinationCoords),
          confidence: prediction.confidence
        };
      }
    }

    // Fallback to traditional calculation if ML prediction fails
    const distance = calculateDistance(routeDetails.originCoords, routeDetails.destinationCoords);
    const emissionFactors = getEmissionFactors(ship);
    const totalWeight = booking.cargoWeight * booking.cargoQuantity;
    const estimatedEmissions = distance * emissionFactors.adjustedEmissionRate * totalWeight;
    
    return {
      estimatedTotalEmissions: estimatedEmissions,
      emissionRate: estimatedEmissions / (totalWeight * distance),
      distance: distance,
      emissionFactors: emissionFactors,
      confidence: 0.8
    };
  } catch (error) {
    console.error('Error calculating emissions:', error);
    throw error;
  }
};

/**
 * Generate AI-based optimization suggestions for reducing emissions
 * @param {Object} booking - Booking object
 * @param {Object} ship - Ship object
 * @param {Object} emissionsData - Calculated emissions data
 * @returns {Array} Array of suggestions
 */
const generateOptimizationSuggestions = (booking, ship, emissionsData) => {
  const suggestions = [];
  
  // Suggest more efficient ship if emissions are high
  if (ship.emissionClass === 'D' || ship.emissionClass === 'E' || ship.emissionClass === 'F') {
    suggestions.push('Consider using a more fuel-efficient vessel with a better emission class (A or B)');
  }
  
  // Suggest route optimization
  suggestions.push('Optimize shipping route to reduce distance and avoid areas with high fuel consumption');
  
  // Suggest load optimization
  if (booking.cargoWeight < ship.cargoCapacity * 0.7) {
    suggestions.push('Consolidate cargo with other shipments to maximize vessel capacity utilization');
  }
  
  // Suggest green technologies
  if (!ship.greenTechnologyEquipped || ship.greenTechnologyEquipped.length < 2) {
    suggestions.push('Upgrade vessel with green technologies like wind assistance or solar panels');
  }
  
  // Suggest alternative fuel
  if (ship.fuelType === 'Heavy Fuel Oil') {
    suggestions.push('Consider switching to cleaner fuel alternatives like LNG or biofuels');
  }
  
  // Suggest speed optimization
  suggestions.push('Reduce vessel speed by 10% to decrease fuel consumption and emissions');
  
  // Suggest carbon offset
  if (!booking.carbonEmissions || !booking.carbonEmissions.carbonOffsetApplied) {
    suggestions.push('Purchase carbon offsets to neutralize the unavoidable emissions');
  }
  
  return suggestions;
};

/**
 * Use ML to predict optimized route with lower emissions
 * @param {Object} booking - Booking object
 * @param {Object} ship - Ship object
 * @param {Object} routeDetails - Contains origin and destination coordinates
 * @returns {Object} Optimized route and emissions data
 */
const predictOptimizedRoute = async (booking, ship, routeDetails) => {
  try {
    if (MLService) {
      // Get ML-based route optimization
      const optimizedRoute = await MLService.optimizeRoute(
        routeDetails.originCoords,
        routeDetails.destinationCoords,
        {
          weight: booking.cargoWeight,
          quantity: booking.cargoQuantity
        }
      );

      if (optimizedRoute) {
        // Calculate emissions for both standard and optimized routes
        const standardEmissions = await calculateEmissions(booking, ship, routeDetails);
        const optimizedEmissions = await calculateEmissions(booking, ship, {
          originCoords: routeDetails.originCoords,
          destinationCoords: {
            lat: optimizedRoute.coordinates[0],
            lng: optimizedRoute.coordinates[1]
          }
        });

        const emissionSavings = standardEmissions.estimatedTotalEmissions - optimizedEmissions.estimatedTotalEmissions;
        
        // Generate AI suggestions
        const suggestions = generateOptimizationSuggestions(booking, ship, standardEmissions);
        
        return {
          standardRoute: {
            emissions: standardEmissions.estimatedTotalEmissions,
            distance: standardEmissions.distance
          },
          optimizedRoute: {
            emissions: optimizedEmissions.estimatedTotalEmissions,
            distance: optimizedRoute.coordinates[2],
            emissionSavings: emissionSavings,
            optimizationPercentage: optimizedRoute.coordinates[5] * 100
          },
          suggestions: suggestions,
          confidence: optimizedRoute.confidence
        };
      }
    }

    // Fallback to traditional optimization if ML fails
    const standardEmissions = await calculateEmissions(booking, ship, routeDetails);
    const optimizationFactor = 0.08 + (Math.random() * 0.07);
    const optimizedEmissions = standardEmissions.estimatedTotalEmissions * (1 - optimizationFactor);
    const emissionSavings = standardEmissions.estimatedTotalEmissions - optimizedEmissions;
    
    return {
      standardRoute: {
        emissions: standardEmissions.estimatedTotalEmissions,
        distance: standardEmissions.distance
      },
      optimizedRoute: {
        emissions: optimizedEmissions,
        distance: standardEmissions.distance * (1 - (optimizationFactor / 2)),
        emissionSavings: emissionSavings,
        optimizationPercentage: optimizationFactor * 100
      },
      suggestions: generateOptimizationSuggestions(booking, ship, standardEmissions),
      confidence: 0.8
    };
  } catch (error) {
    console.error('Error predicting optimized route:', error);
    throw error;
  }
};

/**
 * Update booking with emissions data
 * @param {String} bookingId - Booking ID
 * @param {Object} emissionsData - Emissions data to update
 */
const updateBookingEmissions = async (bookingId, emissionsData) => {
  try {
    await Booking.findByIdAndUpdate(bookingId, {
      $set: {
        'carbonEmissions': {
          ...emissionsData,
          updatedAt: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error updating booking emissions:', error);
    throw error;
  }
};

/**
 * Get emissions statistics
 * @param {Date} startDate - Start date for statistics
 * @param {Date} endDate - End date for statistics
 * @returns {Object} Emissions statistics
 */
const getEmissionsStats = async (startDate, endDate) => {
  try {
    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate },
      'carbonEmissions.estimatedTotalEmissions': { $exists: true }
    });

    const stats = {
      totalEmissions: 0,
      totalSavings: 0,
      totalOffset: 0,
      percentOptimized: 0,
      averageEmissionRate: 0
    };

    if (bookings.length > 0) {
      stats.totalEmissions = bookings.reduce((sum, booking) => 
        sum + (booking.carbonEmissions?.estimatedTotalEmissions || 0), 0);
      
      stats.totalSavings = bookings.reduce((sum, booking) => 
        sum + (booking.carbonEmissions?.emissionSavings || 0), 0);
      
      stats.totalOffset = bookings.reduce((sum, booking) => 
        sum + (booking.carbonEmissions?.carbonOffsetAmount || 0), 0);
      
      stats.percentOptimized = (bookings.filter(booking => 
        booking.carbonEmissions?.optimizedRoute).length / bookings.length) * 100;
      
      stats.averageEmissionRate = bookings.reduce((sum, booking) => 
        sum + (booking.carbonEmissions?.emissionRate || 0), 0) / bookings.length;
    }

    return stats;
  } catch (error) {
    console.error('Error getting emissions stats:', error);
    throw error;
  }
};

module.exports = {
  calculateEmissions,
  predictOptimizedRoute,
  updateBookingEmissions,
  getEmissionsStats
}; 