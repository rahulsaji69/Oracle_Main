/**
 * Carbon Emissions Controller
 * 
 * Handles API endpoints related to carbon emissions calculation,
 * tracking, and reduction.
 */

const Ship = require('../Models/Ship');
const Booking = require('../Models/Bookings');
const CarbonEmissionsService = require('../Services/CarbonEmissionsService');

/**
 * Calculate emissions for a booking
 */
exports.calculateEmissions = async (req, res) => {
  try {
    const { bookingId, shipId, routeDetails } = req.body;
    
    if (!bookingId || !shipId || !routeDetails) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters'
      });
    }
    
    // Fetch booking and ship
    const booking = await Booking.findById(bookingId);
    const ship = await Ship.findById(shipId);
    
    if (!booking || !ship) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking or ship not found'
      });
    }
    
    // Calculate emissions
    const emissionsData = await CarbonEmissionsService.calculateEmissions(
      booking,
      ship,
      routeDetails
    );
    
    // Update booking with calculated emissions
    await CarbonEmissionsService.updateBookingEmissions(bookingId, {
      estimatedTotalEmissions: emissionsData.estimatedTotalEmissions,
      emissionRate: emissionsData.emissionRate
    });
    
    return res.status(200).json({
      status: 'success',
      data: emissionsData
    });
  } catch (error) {
    console.error('Error calculating emissions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to calculate emissions',
      error: error.message
    });
  }
};

/**
 * Get emission optimization suggestions
 */
exports.getOptimizationSuggestions = async (req, res) => {
  try {
    const { bookingId, shipId, routeDetails } = req.body;
    
    if (!bookingId || !shipId || !routeDetails) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters'
      });
    }
    
    // Fetch booking and ship
    const booking = await Booking.findById(bookingId);
    const ship = await Ship.findById(shipId);
    
    if (!booking || !ship) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking or ship not found'
      });
    }
    
    // Predict optimized route
    const optimizationData = await CarbonEmissionsService.predictOptimizedRoute(
      booking,
      ship,
      routeDetails
    );
    
    // Update booking with optimization suggestions
    await CarbonEmissionsService.updateBookingEmissions(bookingId, {
      optimizationSuggestions: optimizationData.suggestions,
      emissionSavings: optimizationData.optimizedRoute.emissionSavings
    });
    
    return res.status(200).json({
      status: 'success',
      data: optimizationData
    });
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get optimization suggestions',
      error: error.message
    });
  }
};

/**
 * Apply optimized route to booking
 */
exports.applyOptimizedRoute = async (req, res) => {
  try {
    const { bookingId, optimizedRoute } = req.body;
    
    if (!bookingId || !optimizedRoute) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters'
      });
    }
    
    // Update booking with optimized route
    const updatedBooking = await CarbonEmissionsService.updateBookingEmissions(bookingId, {
      optimizedRoute: true,
      estimatedTotalEmissions: optimizedRoute.emissions,
      emissionSavings: optimizedRoute.emissionSavings
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Optimized route applied successfully',
      data: {
        booking: updatedBooking
      }
    });
  } catch (error) {
    console.error('Error applying optimized route:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to apply optimized route',
      error: error.message
    });
  }
};

/**
 * Apply carbon offset to booking
 */
exports.applyCarbonOffset = async (req, res) => {
  try {
    const { bookingId, offsetAmount } = req.body;
    
    if (!bookingId || !offsetAmount) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters'
      });
    }
    
    // Update booking with carbon offset
    const updatedBooking = await CarbonEmissionsService.updateBookingEmissions(bookingId, {
      carbonOffsetApplied: true,
      carbonOffsetAmount: offsetAmount
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Carbon offset applied successfully',
      data: {
        booking: updatedBooking
      }
    });
  } catch (error) {
    console.error('Error applying carbon offset:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to apply carbon offset',
      error: error.message
    });
  }
};

/**
 * Get carbon emissions statistics
 */
exports.getEmissionsStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }
    
    const stats = await CarbonEmissionsService.getEmissionsStats(
      new Date(startDate),
      new Date(endDate)
    );
    
    return res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    console.error('Error getting emissions stats:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get emissions statistics',
      error: error.message
    });
  }
}; 