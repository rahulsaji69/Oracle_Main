const Schedule = require('../Models/Schedule'); // Assuming you create a Schedule model

exports.createSchedule = async (req, res) => {
  const { shipId, startingPort, intermediatePorts, destinationPort, currentLocation, eta, etd } = req.body;

  try {
    const newSchedule = new Schedule({
      shipId,
      startingPort,
      intermediatePorts: intermediatePorts.split(',').map(port => port.trim()), // Convert to array
      destinationPort,
      currentLocation,
      eta,
      etd
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('shipId'); // Populate ship details
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
