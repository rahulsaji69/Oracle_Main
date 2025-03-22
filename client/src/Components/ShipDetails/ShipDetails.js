import React, { useState, useEffect } from 'react';
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
    inspectionDate: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const Base_URL = process.env.REACT_APP_BASE_URL;

  // Ship types for dropdown
  const shipTypes = [
    'Container Ship',
    'Bulk Carrier',
    'Tanker',
    'General Cargo',
    'RoRo',
    'Cruise Ship',
    'Ferry',
    'LNG Carrier',
    'LPG Carrier',
    'Chemical Tanker',
    'Offshore Support Vessel'
  ];
  
  // Countries for flag dropdown
  const countries = [
    'Panama',
    'Liberia',
    'Marshall Islands',
    'Hong Kong',
    'Singapore',
    'Malta',
    'Bahamas',
    'Greece',
    'China',
    'Cyprus',
    'Japan',
    'Norway',
    'United Kingdom',
    'Denmark',
    'India',
    'United States',
    'Italy',
    'Germany',
    'South Korea',
    'Netherlands'
  ];

  // Get today's date in YYYY-MM-DD format for datepicker max
  const today = new Date().toISOString().split('T')[0];

  const validate = (name, value) => {
    let error = '';
    switch (name) {
      case 'shipName':
        if (!value.trim()) {
          error = "Ship name is required";
        } else if (value.length < 3) {
          error = "Ship name must be at least 3 characters";
        }
        break;
      case 'imoNumber':
        const imoRegex = /^(?!0)\d{6}$/;
        if (!value.trim()) {
          error = "IMO number is required";
        } else if (!imoRegex.test(value)) {
          error = "IMO number must be 6 digits and not start with 0";
        }
        break;
      case 'shipType':
        if (!value) {
          error = "Ship type is required";
        }
        break;
      case 'flag':
        if (!value) {
          error = "Flag (country) is required";
        }
        break;
      case 'cargoCapacity':
        if (!value) {
          error = "Cargo capacity is required";
        } else if (value <= 0) {
          error = "Cargo capacity must be greater than 0";
        }
        break;
      case 'loa':
        if (!value) {
          error = "Length Overall (LOA) is required";
        } else if (value < 50 || value > 500) {
          error = "LOA must be between 50 and 500 meters";
        }
        break;
      case 'draft':
        if (!value) {
          error = "Draft is required";
        } else if (value <= 0) {
          error = "Draft must be greater than 0 meters";
        } else if (value > 30) {
          error = "Draft cannot exceed 30 meters";
        }
        break;
      case 'beam':
        if (!value) {
          error = "Beam is required";
        } else if (value <= 0) {
          error = "Beam must be greater than 0 meters";
        } else if (value > 70) {
          error = "Beam cannot exceed 70 meters";
        }
        break;
      case 'inspectionDate':
        if (!value) {
          error = "Inspection date is required";
        }
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipData(prevState => ({
      ...prevState,
      [name]: value
    }));
    validate(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validate(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    // Validate each field
    for (const field in shipData) {
      const error = validate(field, shipData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    
    try {
      // Format the data for submission, including inspection status
      const formattedData = {
        ...shipData,
        inspectionStatus: `Passed ${shipData.inspectionDate}`
      };
      
      const response = await axios.post(`${Base_URL}/api/ships`, { 
        shipData: formattedData
      });

      if (response.status === 200) {
        toast.success("Ship added successfully!");
        navigate("/admin-dashboard/ships");
      }
    } catch (error) {
      console.error('Error submitting the ship data:', error);
      toast.error(error.response?.data?.message || "Error adding ship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ship-details-container">
      <h2>Add Ship Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Ship Information</h3>
          
          <div className="form-group">
            <label htmlFor="shipName">Ship Name*</label>
            <input 
              type="text" 
              id="shipName"
              name="shipName" 
              value={shipData.shipName} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Enter ship name" 
              className={errors.shipName ? 'error-input' : ''}
              required 
            />
            {errors.shipName && <span className="error-text">{errors.shipName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="imoNumber">IMO Number*</label>
            <input 
              type="text" 
              id="imoNumber"
              name="imoNumber" 
              value={shipData.imoNumber} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Enter 6-digit IMO number" 
              className={errors.imoNumber ? 'error-input' : ''}
              required 
            />
            {errors.imoNumber && <span className="error-text">{errors.imoNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="shipType">Ship Type*</label>
            <select 
              id="shipType"
              name="shipType" 
              value={shipData.shipType} 
              onChange={handleChange} 
              onBlur={handleBlur}
              className={errors.shipType ? 'error-input' : ''}
              required
            >
              <option value="">Select Ship Type</option>
              {shipTypes.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            {errors.shipType && <span className="error-text">{errors.shipType}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="flag">Flag (Country)*</label>
            <select 
              id="flag"
              name="flag" 
              value={shipData.flag} 
              onChange={handleChange} 
              onBlur={handleBlur}
              className={errors.flag ? 'error-input' : ''}
              required
            >
              <option value="">Select Flag Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
            {errors.flag && <span className="error-text">{errors.flag}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Cargo and Capacity</h3>
          <div className="form-group">
            <label htmlFor="cargoCapacity">Cargo Capacity (TEU)*</label>
            <input 
              type="number" 
              id="cargoCapacity"
              name="cargoCapacity" 
              value={shipData.cargoCapacity} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Enter cargo capacity" 
              className={errors.cargoCapacity ? 'error-input' : ''}
              min="1"
              required 
            />
            {errors.cargoCapacity && <span className="error-text">{errors.cargoCapacity}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Technical Specifications</h3>
          
          <div className="form-group">
            <label htmlFor="loa">Length Overall (LOA) in meters*</label>
            <input 
              type="number" 
              id="loa"
              name="loa" 
              value={shipData.loa} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Enter LOA (50-500 meters)" 
              className={errors.loa ? 'error-input' : ''}
              min="50"
              max="500"
              required 
            />
            {errors.loa && <span className="error-text">{errors.loa}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="draft">Draft in meters*</label>
            <input 
              type="number" 
              id="draft"
              name="draft" 
              value={shipData.draft} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Enter draft" 
              className={errors.draft ? 'error-input' : ''}
              min="1"
              max="30"
              step="0.1"
              required 
            />
            {errors.draft && <span className="error-text">{errors.draft}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="beam">Beam in meters*</label>
            <input 
              type="number" 
              id="beam"
              name="beam" 
              value={shipData.beam} 
              onChange={handleChange} 
              onBlur={handleBlur} 
              placeholder="Enter beam" 
              className={errors.beam ? 'error-input' : ''}
              min="1"
              max="70"
              step="0.1"
              required 
            />
            {errors.beam && <span className="error-text">{errors.beam}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Compliance Information</h3>
          <div className="form-group">
            <label htmlFor="inspectionDate">Inspection Date*</label>
            <input 
              type="date" 
              id="inspectionDate"
              name="inspectionDate" 
              value={shipData.inspectionDate} 
              onChange={handleChange} 
              onBlur={handleBlur}
              className={errors.inspectionDate ? 'error-input' : ''}
              max={today}
              required 
            />
            {errors.inspectionDate && <span className="error-text">{errors.inspectionDate}</span>}
            <small className="help-text">The ship will be marked as "Passed" on the selected date</small>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding Ship...' : 'Add Ship'}
        </button>
      </form>
    </div>
  );
};

export default ShipDetails;
