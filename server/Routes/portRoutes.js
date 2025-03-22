const express = require('express');
const router = express.Router();
const Port = require('../Models/Port');

router.post('/', async (req, res) => {
  try {
    const { country, ports } = req.body;

   
    const portDocument = await Port.findOneAndUpdate(
      { country },
      { $addToSet: { ports: { $each: ports } } },
      { new: true, upsert: true } 
    );

    res.status(201).json(portDocument);
  } catch (error) {
    res.status(500).json({ message: 'Error adding ports', error });
  }
});


router.get('/', async (req, res) => {
    try {
      // Find all port documents with country and ports fields
      const countries = await Port.find({}, 'country ports'); 
      
      // Format ports with country in parentheses
      const formattedPorts = countries.reduce((acc, countryDoc) => {
        const countryName = countryDoc.country;
        const portsWithCountry = countryDoc.ports.map(port => `${port}(${countryName})`);
        return acc.concat(portsWithCountry);
      }, []);
  
      res.status(200).json({ ports: formattedPorts });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving ports', error });
    }
  });
  

module.exports = router;
