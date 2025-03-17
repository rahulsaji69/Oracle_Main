import React, { useState } from 'react';
import './ShipDetails.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ShipDetails = () => {
  const navigate = useNavigate();
  const [shipData, setShipData] = useState({
    shipName: '',
    imoNumber: '',
    shipType: '',
    flag: '',
    cargoCapacity: '',
    loa: '',
    draft: '',
    beam: '',
    inspectionStatus: ''
  });

  const [errors, setErrors] = useState({}); 
  const Base_URL = process.env.REACT_APP_BASE_URL;

  const validate = (name, value) => {
    let error = '';
    switch (name) {
      case 'imoNumber':
        const imoRegex = /^(?!0)\d{6}$/; 
        const invalidImoPatterns = ["123456", "222222"];
        const firstFourDigits = value.slice(0, 4);
        const repeatingDigitsRegex = /^(.)\1{5}$/; 
        if (!imoRegex.test(value) || 
            invalidImoPatterns.includes(value) || 
            firstFourDigits === "1234" || 
            firstFourDigits === "2222" || 
            repeatingDigitsRegex.test(value)) { // Check for continuously repeating digits
          error = "Invalid IMO Number. Must be 6 digits";
        }
        break;
      case 'loa':
        if (value < 250 || value > 500) {
          error = "LOA must be between 250 and 500 metres.";
        }
        break;
      case 'draft':
      case 'beam':
        if (value <= 0) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} must be a positive number in metres.`;
        }
        break;
      case 'inspectionStatus':
        const inspectionStatusRegex = /^Passed \d{4}-\d{2}-\d{2}$/; // Format: Passed YYYY-MM-DD
        if (!inspectionStatusRegex.test(value)) {
          error = "Inspection Status is not correct'.";
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipData(prevState => ({
      ...prevState,
      [name]: value
    }));
    validate(name, value); // Validate on change
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validate(name, value); // Validate on blur
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check before submission
    for (const key in shipData) {
      validate(key, shipData[key]);
    }

    if (Object.values(errors).some(error => error)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.post(`${Base_URL}/api/ships`, { shipData });
      console.log(response);
      if (response.status === 200) {
        console.log("Ship added successfully!");
        navigate("/admin-dashboard/ships");
      }
    } catch (error) {
      console.error('Error submitting the ship data:', error);
    }
  };

  return (
    <div className="ship-details-container">
      <h2>Add Ship Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Ship Information</h3>
          <input type="text" name="shipName" value={shipData.shipName} onChange={handleChange} onBlur={handleBlur} placeholder="Ship Name" required />
          <input type="text" name="imoNumber" value={shipData.imoNumber} onChange={handleChange} onBlur={handleBlur} placeholder="IMO Number" required />
          {errors.imoNumber && <span className="error-text">{errors.imoNumber}</span>}
          <input type="text" name="shipType" value={shipData.shipType} onChange={handleChange} onBlur={handleBlur} placeholder="Ship Type" required />
          <input type="text" name="flag" value={shipData.flag} onChange={handleChange} onBlur={handleBlur} placeholder="Flag" required />
        </div>

        <div className="form-section">
          <h3>Cargo and Capacity</h3>
          <input type="number" name="cargoCapacity" value={shipData.cargoCapacity} onChange={handleChange} onBlur={handleBlur} placeholder="Cargo Capacity" required />
        </div>

        <div className="form-section">
          <h3>Technical Specifications</h3>
          <input type="number" name="loa" value={shipData.loa} onChange={handleChange} onBlur={handleBlur} placeholder="Length Overall (LOA)" required />
          {errors.loa && <span className="error-text">{errors.loa}</span>}
          <input type="number" name="draft" value={shipData.draft} onChange={handleChange} onBlur={handleBlur} placeholder="Draft" required />
          {errors.draft && <span className="error-text">{errors.draft}</span>}
          <input type="number" name="beam" value={shipData.beam} onChange={handleChange} onBlur={handleBlur} placeholder="Beam" required />
          {errors.beam && <span className="error-text">{errors.beam}</span>}
        </div>

        <div className="form-section">
          <h3>Compliance Information</h3>
          <input type="texts" name="inspectionStatus" value={shipData.inspectionStatus} onChange={handleChange} onBlur={handleBlur} placeholder="Inspection Status" required />
          {errors.inspectionStatus && <span className="error-text">{errors.inspectionStatus}</span>}
        </div>

        <button type="submit">Add Ship</button>
      </form>
    </div>
  );
};

export default ShipDetails;
