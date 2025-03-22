import React from 'react';
import './BookingForm.css';

const CargoForm = ({ 
  formData = {}, 
  handleChange, 
  handleFileUpload, 
  errors = {}, 
  ports = [], 
  dateError = '', 
  today = new Date().toISOString().split('T')[0],
  handlePrevStep, 
  handleSubmit,
  submitButtonText = "Submit"
}) => {
  // Ensure cargoDimensions is initialized
  const dimensions = formData.cargoDimensions || { length: '', width: '', height: '' };
  
  return (
    <div className="booking-form">
      <div className="booking-section">
        <h2 className="section-title">Origin and Destination</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="originPort">Origin Port *</label>
            <select 
              id="originPort"
              name="originPort" 
              value={formData.originPort || ''} 
              onChange={handleChange} 
              className={errors.originPort ? 'error' : ''}
            >
              <option value="">Select Origin Port</option>
              {(ports || []).map((port, index) => (
                <option key={index} value={port}>{port}</option>
              ))}
            </select>
            {errors.originPort && <span className="error-message">{errors.originPort}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="destinationPort">Destination Port *</label>
            <select 
              id="destinationPort"
              name="destinationPort" 
              value={formData.destinationPort || ''} 
              onChange={handleChange} 
              className={errors.destinationPort ? 'error' : ''}
            >
              <option value="">Select Destination Port</option>
              {(ports || []).map((port, index) => (
                <option key={index} value={port}>{port}</option>
              ))}
            </select>
            {errors.destinationPort && <span className="error-message">{errors.destinationPort}</span>}
          </div>
        </div>
      </div>

      <div className="booking-section">
        <h2 className="section-title">Container Details</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="containerType">Container Type *</label>
            <select 
              id="containerType"
              name="containerType" 
              value={formData.containerType || ''} 
              onChange={handleChange} 
              className={errors.containerType ? 'error' : ''}
            >
              <option value="">Select Container Type</option>
              <option value="dry">Dry Container</option>
              <option value="reefer">Reefer Container</option>
              <option value="open-top">Open Top Container</option>
              <option value="flat-rack">Flat Rack Container</option>
              <option value="tank">Tank Container</option>
            </select>
            {errors.containerType && <span className="error-message">{errors.containerType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="containerSize">Container Size *</label>
            <select 
              id="containerSize"
              name="containerSize" 
              value={formData.containerSize || ''} 
              onChange={handleChange} 
              className={errors.containerSize ? 'error' : ''}
            >
              <option value="">Select Container Size</option>
              <option value="20ft">20ft Standard</option>
              <option value="40ft">40ft Standard</option>
              <option value="40ft-hc">40ft High Cube</option>
            </select>
            {errors.containerSize && <span className="error-message">{errors.containerSize}</span>}
          </div>
        </div>
      </div>

      <div className="booking-section">
        <h2 className="section-title">Cargo Details</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cargoType">Cargo Type *</label>
            <select 
              id="cargoType"
              name="cargoType" 
              value={formData.cargoType || ''} 
              onChange={handleChange} 
              className={errors.cargoType ? 'error' : ''}
            >
              <option value="">Select Cargo Type</option>
              <option value="general">General Cargo</option>
              <option value="perishable">Perishable Goods</option>
              <option value="dangerous">Dangerous Goods</option>
              <option value="valuable">Valuable Cargo</option>
            </select>
            {errors.cargoType && <span className="error-message">{errors.cargoType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cargoWeight">Cargo Weight (kg) *</label>
            <input 
              type="number" 
              id="cargoWeight"
              name="cargoWeight" 
              value={formData.cargoWeight || ''} 
              onChange={handleChange} 
              placeholder="Enter weight in kg" 
              className={errors.cargoWeight ? 'error' : ''}
            />
            {errors.cargoWeight && <span className="error-message">{errors.cargoWeight}</span>}
          </div>
        </div>

        <div className="dimensions-container">
          <h4>Cargo Dimensions (cm)</h4>
          <div className="dimensions-group">
            <div className="form-group">
              <label htmlFor="cargoDimensions.length">Length</label>
              <input 
                type="number" 
                id="cargoDimensions.length"
                name="cargoDimensions.length" 
                value={dimensions.length} 
                onChange={handleChange} 
                placeholder="Length" 
                className={errors["cargoDimensions.length"] ? 'error' : ''}
              />
              {errors["cargoDimensions.length"] && <span className="error-message">{errors["cargoDimensions.length"]}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cargoDimensions.width">Width</label>
              <input 
                type="number" 
                id="cargoDimensions.width"
                name="cargoDimensions.width" 
                value={dimensions.width} 
                onChange={handleChange} 
                placeholder="Width" 
                className={errors["cargoDimensions.width"] ? 'error' : ''}
              />
              {errors["cargoDimensions.width"] && <span className="error-message">{errors["cargoDimensions.width"]}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="cargoDimensions.height">Height</label>
              <input 
                type="number" 
                id="cargoDimensions.height"
                name="cargoDimensions.height" 
                value={dimensions.height} 
                onChange={handleChange} 
                placeholder="Height" 
                className={errors["cargoDimensions.height"] ? 'error' : ''}
              />
              {errors["cargoDimensions.height"] && <span className="error-message">{errors["cargoDimensions.height"]}</span>}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cargoQuantity">Quantity</label>
            <input 
              type="number" 
              id="cargoQuantity"
              name="cargoQuantity" 
              value={formData.cargoQuantity || ''} 
              onChange={handleChange} 
              placeholder="Number of items" 
              className={errors.cargoQuantity ? 'error' : ''}
            />
            {errors.cargoQuantity && <span className="error-message">{errors.cargoQuantity}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cargoValue">Cargo Value</label>
            <input 
              type="number" 
              id="cargoValue"
              name="cargoValue" 
              value={formData.cargoValue || ''} 
              onChange={handleChange} 
              placeholder="Value in currency" 
              className={errors.cargoValue ? 'error' : ''}
            />
            {errors.cargoValue && <span className="error-message">{errors.cargoValue}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-field">
            <input 
              type="checkbox" 
              id="isHazardous"
              name="isHazardous" 
              checked={formData.isHazardous || false} 
              onChange={handleChange} 
            />
            <label htmlFor="isHazardous">Hazardous Materials</label>
          </div>

          <div className="form-group checkbox-field">
            <input 
              type="checkbox" 
              id="requiresRefrigeration"
              name="requiresRefrigeration" 
              checked={formData.requiresRefrigeration || false} 
              onChange={handleChange} 
            />
            <label htmlFor="requiresRefrigeration">Requires Refrigeration</label>
          </div>
        </div>
      </div>

      <div className="booking-section">
        <h2 className="section-title">Schedule</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="preferredShippingDate">Preferred Shipping Date *</label>
            <input 
              type="date" 
              id="preferredShippingDate"
              name="preferredShippingDate" 
              value={formData.preferredShippingDate || ''} 
              onChange={handleChange} 
              min={today}
              className={dateError || errors.preferredShippingDate ? 'error' : ''}
            />
            {dateError && <span className="error-message">{dateError}</span>}
            {errors.preferredShippingDate && <span className="error-message">{errors.preferredShippingDate}</span>}
          </div>
        </div>
      </div>

      <div className="form-navigation">
        <button 
          type="button" 
          className="back-button" 
          onClick={handlePrevStep}
        >
          Back: Shipper & Receiver
        </button>
        <button 
          type="button" 
          className="next-button find-ships-button"
          onClick={handleSubmit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          {submitButtonText || 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default CargoForm; 