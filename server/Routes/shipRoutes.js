const express = require('express');
const router = express.Router();
const shipController = require('../Controllers/shipController');
const scheduleController = require('../Controllers/scheduleController'); // Import the schedule controller

router.post('/', shipController.createShip);

router.get('/', shipController.getShips);

router.delete('/:id', shipController.deleteShip);

// Schedule routes
router.post('/schedules', scheduleController.createSchedule); // Add schedule

router.get('/schedules', scheduleController.getSchedules); // Get schedules

module.exports = router;
