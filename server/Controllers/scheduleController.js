const Schedule = require('../Models/Schedule'); // Assuming you create a Schedule model
const Port = require('../Models/Port'); // Import Port model for country checks

// Helper function to extract port name without country
const getPortNameOnly = (portWithCountry) => {
  // If port contains parentheses, extract just the port name
  const match = portWithCountry.match(/^(.+?)\([^)]+\)$/);
  return match ? match[1].trim() : portWithCountry.trim();
};

exports.createSchedule = async (req, res) => {
  const { shipId, startingPort, intermediatePorts, destinationPort, currentLocation, eta, etd } = req.body;

  try {
    // Extract core port names for storage in database
    const startingPortClean = getPortNameOnly(startingPort);
    const destinationPortClean = getPortNameOnly(destinationPort);
    const intermediatePortsClean = intermediatePorts.split(',')
      .map(port => getPortNameOnly(port.trim()));
    const currentLocationClean = getPortNameOnly(currentLocation);

    const newSchedule = new Schedule({
      shipId,
      startingPort: startingPortClean,
      intermediatePorts: intermediatePortsClean,
      destinationPort: destinationPortClean,
      currentLocation: currentLocationClean,
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
