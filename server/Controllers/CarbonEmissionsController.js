/**
 * Carbon Emissions Controller
 * 
 * Handles API endpoints related to carbon emissions calculation,
 * tracking, and reduction.
 */

const Ship = require('../Models/Ship');
const Booking = require('../Models/Bookings');
const CarbonEmissionsService = require('../Services/CarbonEmissionsService');
const mongoose = require('mongoose');
const emissionsPrediction = require('../ML/emissionsPrediction');
const emissionsAnalysis = require('../ML/emissionsAnalysis');

/**
 * Calculate emissions for a booking
 */
exports.calculateEmissions = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;
    
    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }
    
    const booking = await Booking.findById(bookingId).populate('assignedShip');
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // If ship is already assigned, calculate with that ship
    if (booking.assignedShip) {
      const emissions = await emissionsPrediction.basicEmissionEstimate(booking, booking.assignedShip);
      
      // Update booking with predicted emissions
      booking.carbonEmissions = {
        ...booking.carbonEmissions,
        estimatedTotalEmissions: emissions
      };
      
      await booking.save();
      
      return res.status(200).json({
        success: true,
        data: {
          estimatedEmissions: emissions,
          booking: booking._id,
          ship: booking.assignedShip._id
        }
      });
    } else {
      // No ship assigned, return error
      return res.status(400).json({
        success: false,
        message: 'No ship assigned to booking'
      });
    }
    
  } catch (error) {
    console.error('Error calculating emissions:', error);
    res.status(500).json({ success: false, message: 'Error calculating emissions' });
  }
};

/**
 * Get optimization suggestions for ship selection based on emissions
 */
exports.getOptimizationSuggestions = async (req, res) => {
  try {
    const { bookingId, shipId, originPort, destinationPort, cargoWeight, cargoQuantity, calculationOnly, cargoType, isHazardous, requiresRefrigeration } = req.body;
    
    // Handle direct calculation requests (no booking ID)
    if (calculationOnly) {
      // Validate required parameters for calculation
      if (!originPort || !destinationPort || !cargoWeight) {
        return res.status(400).json({ 
          success: false, 
          message: 'Origin port, destination port, and cargo weight are required for emissions calculation'
        });
      }
      
      // Create temporary booking object for calculation
      const tempBooking = {
        cargoWeight: parseFloat(cargoWeight) || 1000, // Convert to number, default to 1 ton if not provided
        cargoQuantity: parseInt(cargoQuantity) || 1,
        originPort: originPort,
        destinationPort: destinationPort,
        cargoType: cargoType || 'General',
        isHazardous: isHazardous === true,
        requiresRefrigeration: requiresRefrigeration === true
      };
      
      if (shipId) {
        // Calculate emissions for a specific ship
        const ship = await Ship.findById(shipId);
        
        if (!ship) {
          return res.status(404).json({
            success: false,
            message: 'Ship not found'
          });
        }
        
        const emissions = await emissionsPrediction.basicEmissionEstimate(tempBooking, ship);
        
        return res.status(200).json({
          success: true,
          data: {
            estimatedEmissions: emissions,
            emissionEfficiency: emissions / (tempBooking.cargoWeight * getPortDistance(originPort, destinationPort)),
            shipName: ship.shipName,
            shipId: ship._id,
            isOptimal: true
          }
        });
      } else {
        // Find all suitable ships and calculate emissions for each
        const potentialShips = await Ship.find({
          // Find ships with capacity for the cargo
          cargoCapacity: { $gte: tempBooking.cargoWeight }
        }).limit(5); // Limit to 5 ships for performance
        
        if (potentialShips.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'No suitable ships found for this cargo'
          });
        }
        
        // Calculate emissions for each ship using simpler direct calculation
        const shipsWithEmissions = potentialShips.map(ship => {
          const emissions = emissionsPrediction.basicEmissionEstimate(tempBooking, ship);
          return {
            ...ship.toObject(),
            predictedEmissions: emissions
          };
        });
        
        // Sort by emissions (lowest first)
        shipsWithEmissions.sort((a, b) => a.predictedEmissions - b.predictedEmissions);
        
        // Mark the best ship as optimal
        if (shipsWithEmissions.length > 0) {
          shipsWithEmissions[0].isOptimal = true;
        }
        
        return res.status(200).json({
          success: true,
          data: {
            ships: shipsWithEmissions.map(ship => ({
              shipId: ship._id,
              shipName: ship.shipName,
              estimatedEmissions: ship.predictedEmissions,
              isOptimal: ship.isOptimal || false
            }))
          }
        });
      }
    }
    
    // Original booking-based optimization logic
    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Get available ships that can handle this cargo
    const potentialShips = await Ship.find({
      cargoCapacity: { $gte: booking.cargoWeight }
    });
    
    if (potentialShips.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No suitable ships found for this cargo'
      });
    }
    
    // Predict emissions for each ship
    const shipsWithEmissions = await emissionsPrediction.predictEmissionsForShips(booking, potentialShips);
    
    // Sort by emissions (lowest first)
    shipsWithEmissions.sort((a, b) => a.predictedEmissions - b.predictedEmissions);
    
    // Return top 5 options
    const topOptions = shipsWithEmissions.slice(0, 5);
    
    // Calculate potential savings compared to average
    const averageEmissions = shipsWithEmissions.reduce((sum, ship) => sum + ship.predictedEmissions, 0) / shipsWithEmissions.length;
    
    // Generate text suggestions
    const suggestions = [];
    
    if (topOptions[0].predictedEmissions < averageEmissions * 0.8) {
      suggestions.push(`Using ${topOptions[0].shipName} could reduce CO2 emissions by up to ${Math.round((averageEmissions - topOptions[0].predictedEmissions) / averageEmissions * 100)}% compared to average.`);
    }
    
    if (topOptions[0].fuelType === 'Liquefied Natural Gas' || topOptions[0].fuelType === 'Biofuel') {
      suggestions.push(`${topOptions[0].shipName} uses low-emission fuel (${topOptions[0].fuelType}).`);
    }
    
    if (topOptions[0].greenTechnologyEquipped && topOptions[0].greenTechnologyEquipped.length > 0) {
      suggestions.push(`${topOptions[0].shipName} is equipped with green technologies: ${topOptions[0].greenTechnologyEquipped.join(', ')}.`);
    }
    
    return res.status(200).json({
      success: true,
      data: {
        optimalShips: topOptions,
        averageEmissions,
        suggestions
      }
    });
    
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    res.status(500).json({ success: false, message: 'Error getting optimization suggestions' });
  }
};

// Helper function to get distance between ports
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

/**
 * Apply optimized route by assigning the optimal ship
 */
exports.applyOptimizedRoute = async (req, res) => {
  try {
    const { bookingId, shipId } = req.body;
    
    if (!bookingId || !shipId) {
      return res.status(400).json({ success: false, message: 'Booking ID and Ship ID are required' });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    const ship = await Ship.findById(shipId);
    if (!ship) {
      return res.status(404).json({ success: false, message: 'Ship not found' });
    }
    
    // Calculate emissions with selected ship
    const emissions = await emissionsPrediction.basicEmissionEstimate(booking, ship);
    
    // Update booking with selected ship and emissions data
    booking.assignedShip = shipId;
    booking.carbonEmissions = {
      ...booking.carbonEmissions,
      estimatedTotalEmissions: emissions,
      optimizedRoute: true
    };
    
    await booking.save();
    
    return res.status(200).json({
      success: true,
      message: 'Optimized route applied successfully',
      data: {
        booking: booking._id,
        ship: ship._id,
        estimatedEmissions: emissions
      }
    });
    
  } catch (error) {
    console.error('Error applying optimized route:', error);
    res.status(500).json({ success: false, message: 'Error applying optimized route' });
  }
};

/**
 * Apply carbon offset to booking
 */
exports.applyCarbonOffset = async (req, res) => {
  try {
    const { bookingId, offsetAmount } = req.body;
    
    if (!bookingId || !offsetAmount) {
      return res.status(400).json({ success: false, message: 'Booking ID and offset amount are required' });
    }
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Apply carbon offset
    booking.carbonEmissions = {
      ...booking.carbonEmissions,
      carbonOffsetApplied: true,
      carbonOffsetAmount: offsetAmount
    };
    
    await booking.save();
    
    return res.status(200).json({
      success: true,
      message: 'Carbon offset applied successfully',
      data: {
        booking: booking._id,
        carbonOffsetAmount: offsetAmount
      }
    });
    
  } catch (error) {
    console.error('Error applying carbon offset:', error);
    res.status(500).json({ success: false, message: 'Error applying carbon offset' });
  }
};

/**
 * Get emissions statistics for admin dashboard
 */
exports.getEmissionsStats = async (req, res) => {
  try {
    // Get time period filters from request query
    const { startDate, endDate } = req.query;
    const timeFilter = {};
    
    if (startDate) {
      timeFilter.createdAt = { $gte: new Date(startDate) };
    }
    
    if (endDate) {
      timeFilter.createdAt = { ...timeFilter.createdAt, $lte: new Date(endDate) };
    }
    
    // Get bookings with emissions data
    const bookings = await Booking.find({
      ...timeFilter,
      'carbonEmissions.estimatedTotalEmissions': { $exists: true }
    }).populate('assignedShip');
    
    if (bookings.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalEmissions: 0,
          averageEmissions: 0,
          offsetApplied: 0,
          emissionsByShipType: [],
          emissionsTrend: [],
          topPerformingShips: []
        }
      });
    }
    
    // Calculate total and average emissions
    const totalEmissions = bookings.reduce((total, booking) => 
      total + (booking.carbonEmissions.estimatedTotalEmissions || 0), 0);
    
    const averageEmissions = totalEmissions / bookings.length;
    
    // Calculate total offset
    const offsetApplied = bookings.reduce((total, booking) => 
      total + (booking.carbonEmissions.carbonOffsetAmount || 0), 0);
    
    // Get emissions by ship type
    const emissionsByShipType = await emissionsAnalysis.getEmissionsByShipType(bookings);
    
    // Get emissions trend (last 6 months)
    const emissionsTrend = await emissionsAnalysis.getEmissionsTrend();
    
    // Get top performing ships
    const topPerformingShips = await emissionsAnalysis.getTopPerformingShips();
    
    // Return statistics
    return res.status(200).json({
      success: true,
      data: {
        totalEmissions,
        averageEmissions,
        offsetApplied,
        emissionsByShipType,
        emissionsTrend,
        topPerformingShips
      }
    });
    
  } catch (error) {
    console.error('Error getting emissions statistics:', error);
    res.status(500).json({ success: false, message: 'Error getting emissions statistics' });
  }
}; 