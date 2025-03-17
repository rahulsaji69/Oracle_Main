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
      
      const countries = await Port.find({}, 'ports'); 
      
      const allPorts = countries.reduce((acc, country) => {
        return acc.concat(country.ports);
      }, []);
  
      res.status(200).json({ ports: allPorts });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving ports', error });
    }
  });
  

module.exports = router;
