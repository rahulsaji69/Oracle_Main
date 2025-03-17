const Ship = require('../Models/Ship'); // Assuming you have a Ship model

exports.createShip = async (req, res) => {
    // Destructure fields from the request body
    const { shipName, imoNumber, shipType, flag, cargoCapacity, loa, draft, beam, inspectionStatus } = req.body.shipData;
   console.log( shipName, imoNumber, shipType, flag, cargoCapacity, loa, draft, beam, inspectionStatus)
    try {
      const ship = new Ship({
        shipName,           
        imoNumber,         
        shipType,             
        flag,                
        cargoCapacity,      
        loa,                 
        draft,               
        beam,                
        inspectionStatus     
      });
  
      const newShip = await ship.save();
  
      res.status(200).json(newShip);
  
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: "Failed to create ship", error });
    }
  };
  

exports.getShips = async (req, res) => {
  try {
    const ships = await Ship.find();
    res.status(200).json(ships);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve ships", error });
  }
};


exports.deleteShip = async (req, res) => {
  try {
    const { id } = req.params;
    const ship = await Ship.findByIdAndDelete(id);

    if (!ship) {
      return res.status(404).json({ message: "Ship not found" });
    }

    res.status(200).json({ message: "Ship deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ship", error });
  }
};
