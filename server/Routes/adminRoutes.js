const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminControllerr');
const carbonEmissionsController = require('../Controllers/CarbonEmissionsController');


router.get('/users', adminController.getUsers);

router.put('/users/:userId/status', adminController.changeStatus);

// Admin dashboard routes
router.get('/dashboard', (req, res) => {
  res.status(200).json({ message: 'Admin dashboard' });
});

// CO2 Emissions Analytics Routes
router.get('/emissions/stats', carbonEmissionsController.getEmissionsStats);
router.post('/emissions/compare-ships', async (req, res) => {
  try {
    const { shipIds } = req.body;
    const emissionsAnalysis = require('../ML/emissionsAnalysis');
    const comparison = await emissionsAnalysis.compareShipEmissions(shipIds);
    res.status(200).json(comparison);
  } catch (error) {
    console.error('Error comparing ships:', error);
    res.status(500).json({ success: false, message: 'Error comparing ships' });
  }
});

router.get('/emissions/recommendations', async (req, res) => {
  try {
    const emissionsAnalysis = require('../ML/emissionsAnalysis');
    const recommendations = await emissionsAnalysis.getEmissionsReductionRecommendations();
    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ success: false, message: 'Error getting recommendations' });
  }
});

router.post('/emissions/update-journey', async (req, res) => {
  try {
    const { bookingId, actualData } = req.body;
    const emissionsAnalysis = require('../ML/emissionsAnalysis');
    const result = await emissionsAnalysis.updateEmissionsAnalytics(bookingId, actualData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating journey data:', error);
    res.status(500).json({ success: false, message: 'Error updating journey data' });
  }
});

module.exports = router;