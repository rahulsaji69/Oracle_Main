const express = require('express');
const router = express.Router();
const carbonEmissionsController = require('../Controllers/CarbonEmissionsController');

// Calculate emissions for a booking
router.post('/calculate', carbonEmissionsController.calculateEmissions);

// Get optimization suggestions
router.post('/optimize', carbonEmissionsController.getOptimizationSuggestions);

// Apply optimized route
router.post('/apply-optimized-route', carbonEmissionsController.applyOptimizedRoute);

// Apply carbon offset
router.post('/apply-offset', carbonEmissionsController.applyCarbonOffset);

// Get emissions statistics
router.get('/stats', carbonEmissionsController.getEmissionsStats);

module.exports = router; 