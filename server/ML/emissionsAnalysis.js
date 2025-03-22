const mongoose = require('mongoose');
const Booking = require('../Models/Bookings');
const Ship = require('../Models/Ship');

/**
 * Get emissions by ship type for admin analytics
 * @param {Array} bookings - Array of booking objects with populated ships
 * @returns {Promise<Array>} Emissions by ship type
 */
exports.getEmissionsByShipType = async (bookings = null) => {
  try {
    // If bookings are not provided, fetch them
    if (!bookings) {
      bookings = await Booking.find({
        'carbonEmissions.estimatedTotalEmissions': { $exists: true }
      }).populate('assignedShip');
    }
    
    // Group emissions by ship type
    const emissionsByType = {};
    const countByType = {};
    
    bookings.forEach(booking => {
      if (!booking.assignedShip || !booking.assignedShip.shipType) return;
      
      const shipType = booking.assignedShip.shipType;
      const emissions = booking.carbonEmissions.estimatedTotalEmissions || 0;
      
      if (!emissionsByType[shipType]) {
        emissionsByType[shipType] = 0;
        countByType[shipType] = 0;
      }
      
      emissionsByType[shipType] += emissions;
      countByType[shipType]++;
    });
    
    // Convert to array with averages
    return Object.keys(emissionsByType).map(shipType => ({
      shipType,
      totalEmissions: emissionsByType[shipType],
      bookingCount: countByType[shipType],
      averageEmissions: emissionsByType[shipType] / countByType[shipType]
    }));
    
  } catch (error) {
    console.error('Error getting emissions by ship type:', error);
    return [];
  }
};

/**
 * Get emissions trend over time (last 6 months)
 * @returns {Promise<Array>} Emissions trend data
 */
exports.getEmissionsTrend = async () => {
  try {
    // Get date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    // Get bookings from last 6 months with emissions data
    const bookings = await Booking.find({
      createdAt: { $gte: sixMonthsAgo },
      'carbonEmissions.estimatedTotalEmissions': { $exists: true }
    }).sort('createdAt');
    
    // Group by month
    const monthlyData = {};
    
    bookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const emissions = booking.carbonEmissions.estimatedTotalEmissions || 0;
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          totalEmissions: 0,
          bookingCount: 0,
          optimizedCount: 0,
          offsetCount: 0
        };
      }
      
      monthlyData[month].totalEmissions += emissions;
      monthlyData[month].bookingCount++;
      
      if (booking.carbonEmissions.optimizedRoute) {
        monthlyData[month].optimizedCount++;
      }
      
      if (booking.carbonEmissions.carbonOffsetApplied) {
        monthlyData[month].offsetCount++;
      }
    });
    
    // Convert to array and calculate averages
    return Object.keys(monthlyData).sort().map(month => ({
      month,
      totalEmissions: monthlyData[month].totalEmissions,
      bookingCount: monthlyData[month].bookingCount,
      averageEmissions: monthlyData[month].totalEmissions / monthlyData[month].bookingCount,
      optimizedPercentage: (monthlyData[month].optimizedCount / monthlyData[month].bookingCount) * 100,
      offsetPercentage: (monthlyData[month].offsetCount / monthlyData[month].bookingCount) * 100
    }));
    
  } catch (error) {
    console.error('Error getting emissions trend:', error);
    return [];
  }
};

/**
 * Get top performing ships based on emissions efficiency
 * @returns {Promise<Array>} Top performing ships
 */
exports.getTopPerformingShips = async () => {
  try {
    // Get ships with complete emissions history
    const ships = await Ship.find({
      'emissionsHistory.0': { $exists: true }
    });
    
    // Calculate average efficiency for each ship
    const shipsWithEfficiency = ships.map(ship => {
      // Calculate average emissions per ton-mile
      let totalEfficiency = 0;
      let count = 0;
      
      ship.emissionsHistory.forEach(entry => {
        if (entry.emissionEfficiency && entry.emissionEfficiency > 0) {
          totalEfficiency += entry.emissionEfficiency;
          count++;
        }
      });
      
      const averageEfficiency = count > 0 ? totalEfficiency / count : null;
      
      return {
        _id: ship._id,
        shipName: ship.shipName,
        shipType: ship.shipType,
        averageEfficiency,
        historyCount: ship.emissionsHistory.length,
        fuelType: ship.fuelType,
        emissionClass: ship.emissionClass,
        greenTechnologyCount: ship.greenTechnologyEquipped ? ship.greenTechnologyEquipped.length : 0
      };
    }).filter(ship => ship.averageEfficiency !== null);
    
    // Sort by efficiency (lower is better)
    shipsWithEfficiency.sort((a, b) => a.averageEfficiency - b.averageEfficiency);
    
    // Return top 10
    return shipsWithEfficiency.slice(0, 10);
    
  } catch (error) {
    console.error('Error getting top performing ships:', error);
    return [];
  }
};

/**
 * Compare ship emissions efficiency
 * @param {Array} shipIds - Array of ship IDs to compare
 * @returns {Promise<Object>} Comparison data
 */
exports.compareShipEmissions = async (shipIds) => {
  try {
    if (!shipIds || !Array.isArray(shipIds) || shipIds.length === 0) {
      return { success: false, message: 'No ships provided for comparison' };
    }
    
    // Get ships by IDs
    const ships = await Ship.find({
      _id: { $in: shipIds }
    });
    
    if (ships.length === 0) {
      return { success: false, message: 'No ships found with provided IDs' };
    }
    
    // Calculate metrics for each ship
    const comparisonData = ships.map(ship => {
      // Calculate average emissions per ton-mile from history
      let totalEmissions = 0;
      let totalTonMiles = 0;
      
      ship.emissionsHistory.forEach(entry => {
        if (entry.totalEmissions && entry.distance && entry.cargoWeight) {
          totalEmissions += entry.totalEmissions;
          totalTonMiles += entry.distance * entry.cargoWeight;
        }
      });
      
      const emissionsPerTonMile = totalTonMiles > 0 ? totalEmissions / totalTonMiles : null;
      
      return {
        _id: ship._id,
        shipName: ship.shipName,
        shipType: ship.shipType,
        fuelType: ship.fuelType,
        emissionClass: ship.emissionClass,
        greenTechnology: ship.greenTechnologyEquipped || [],
        emissionsPerTonMile,
        totalHistoricalEmissions: totalEmissions,
        journeyCount: ship.emissionsHistory.length
      };
    });
    
    return {
      success: true,
      data: comparisonData
    };
    
  } catch (error) {
    console.error('Error comparing ship emissions:', error);
    return { success: false, message: 'Error comparing ship emissions' };
  }
};

/**
 * Get emissions reduction recommendations
 * @returns {Promise<Array>} Recommendations for emissions reduction
 */
exports.getEmissionsReductionRecommendations = async () => {
  try {
    // Get all ships
    const ships = await Ship.find();
    
    // Get all bookings with emissions data
    const bookings = await Booking.find({
      'carbonEmissions.estimatedTotalEmissions': { $exists: true }
    }).populate('assignedShip');
    
    if (ships.length === 0 || bookings.length === 0) {
      return [];
    }
    
    // Calculate average emissions for each ship type
    const emissionsByShipType = {};
    const countByShipType = {};
    
    bookings.forEach(booking => {
      if (!booking.assignedShip || !booking.assignedShip.shipType) return;
      
      const shipType = booking.assignedShip.shipType;
      const emissions = booking.carbonEmissions.estimatedTotalEmissions || 0;
      
      if (!emissionsByShipType[shipType]) {
        emissionsByShipType[shipType] = 0;
        countByShipType[shipType] = 0;
      }
      
      emissionsByShipType[shipType] += emissions;
      countByShipType[shipType]++;
    });
    
    // Generate recommendations
    const recommendations = [];
    
    // 1. Identify ship types with high emissions
    Object.keys(emissionsByShipType).forEach(shipType => {
      const avgEmissions = emissionsByShipType[shipType] / countByShipType[shipType];
      
      if (avgEmissions > 1000) { // Threshold for "high emissions"
        recommendations.push({
          type: 'shipType',
          severity: 'high',
          title: `High emissions from ${shipType} ships`,
          description: `${shipType} ships emit ${Math.round(avgEmissions)} kg CO2 on average per shipment.`,
          recommendation: `Consider using alternative ship types or investing in green technology for ${shipType} ships.`
        });
      }
    });
    
    // 2. Identify ships without green technology
    const shipsWithoutGreenTech = ships.filter(ship => 
      !ship.greenTechnologyEquipped || ship.greenTechnologyEquipped.length === 0
    );
    
    if (shipsWithoutGreenTech.length > 0) {
      recommendations.push({
        type: 'technology',
        severity: 'medium',
        title: 'Ships lacking green technology',
        description: `${shipsWithoutGreenTech.length} ships in the fleet have no green technologies equipped.`,
        recommendation: 'Consider investing in green technologies like wind assist, solar panels, or hull optimization.'
      });
    }
    
    // 3. Recommend fuel type upgrades
    const shipsWithHighEmissionFuel = ships.filter(ship => 
      ship.fuelType === 'Heavy Fuel Oil'
    );
    
    if (shipsWithHighEmissionFuel.length > 0) {
      recommendations.push({
        type: 'fuel',
        severity: 'high',
        title: 'High-emission fuel usage',
        description: `${shipsWithHighEmissionFuel.length} ships use Heavy Fuel Oil, which has higher emissions.`,
        recommendation: 'Consider transitioning to cleaner fuels like LNG or biofuels for these ships.'
      });
    }
    
    return recommendations;
    
  } catch (error) {
    console.error('Error getting emissions reduction recommendations:', error);
    return [];
  }
};

/**
 * Update emissions analytics after a completed journey
 * @param {String} bookingId - Booking ID
 * @param {Object} actualData - Actual emissions data from the journey
 * @returns {Promise<Object>} Updated booking and ship
 */
exports.updateEmissionsAnalytics = async (bookingId, actualData) => {
  try {
    const booking = await Booking.findById(bookingId).populate('assignedShip');
    
    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }
    
    if (!booking.assignedShip) {
      return { success: false, message: 'No ship assigned to this booking' };
    }
    
    // Update booking with actual emissions
    booking.carbonEmissions.actualEmissions = actualData.emissions;
    await booking.save();
    
    // Update ship's emissions history
    const ship = await Ship.findById(booking.assignedShip._id);
    
    if (!ship) {
      return { success: false, message: 'Ship not found' };
    }
    
    // Calculate efficiency (emissions per ton-mile)
    const distance = actualData.distance || getPortDistance(booking.originPort, booking.destinationPort);
    const weight = booking.cargoWeight;
    const efficiency = weight > 0 && distance > 0 ? actualData.emissions / (weight * distance) : null;
    
    // Add to emissions history
    if (!ship.emissionsHistory) {
      ship.emissionsHistory = [];
    }
    
    ship.emissionsHistory.push({
      date: new Date(),
      totalEmissions: actualData.emissions,
      distance: distance,
      cargoWeight: weight,
      emissionEfficiency: efficiency
    });
    
    // Update ship's average CO2 per ton-mile
    let totalEfficiency = 0;
    let count = 0;
    
    ship.emissionsHistory.forEach(entry => {
      if (entry.emissionEfficiency) {
        totalEfficiency += entry.emissionEfficiency;
        count++;
      }
    });
    
    if (count > 0) {
      ship.co2PerTonMile = totalEfficiency / count;
    }
    
    await ship.save();
    
    return {
      success: true,
      booking,
      ship
    };
    
  } catch (error) {
    console.error('Error updating emissions analytics:', error);
    return { success: false, message: 'Error updating emissions analytics' };
  }
};

// Helper functions
function getPortDistance(originPort, destinationPort) {
  // Simple port distance lookup - in a real implementation, this would use a database
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