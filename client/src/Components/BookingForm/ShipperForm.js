import React from 'react';
import './BookingForm.css';

const ShipperForm = ({ formData = {}, handleChange, errors = {}, handleNextStep }) => {
  return (
    <div className="booking-form">
      <div className="booking-section">
        <h2 className="section-title">Shipper Information</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="shipperName">Shipper Name *</label>
            <input
              type="text"
              id="shipperName"
              name="shipperName"
              value={formData.shipperName || ''}
              onChange={handleChange}
              placeholder="Enter shipper name"
              className={errors.shipperName ? 'error' : ''}
            />
            {errors.shipperName && <span className="error-message">{errors.shipperName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="shipperCompany">Company</label>
            <input
              type="text"
              id="shipperCompany"
              name="shipperCompany"
              value={formData.shipperCompany || ''}
              onChange={handleChange}
              placeholder="Enter company name"
              className={errors.shipperCompany ? 'error' : ''}
            />
            {errors.shipperCompany && <span className="error-message">{errors.shipperCompany}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="shipperPhone">Phone Number *</label>
            <input
              type="tel"
              id="shipperPhone"
              name="shipperPhone"
              value={formData.shipperPhone || ''}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={errors.shipperPhone ? 'error' : ''}
            />
            {errors.shipperPhone && <span className="error-message">{errors.shipperPhone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="shipperEmail">Email *</label>
            <input
              type="email"
              id="shipperEmail"
              name="shipperEmail"
              value={formData.shipperEmail || ''}
              onChange={handleChange}
              placeholder="Enter email address"
              className={errors.shipperEmail ? 'error' : ''}
            />
            {errors.shipperEmail && <span className="error-message">{errors.shipperEmail}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="shipperAddress">Address *</label>
          <input
            type="text"
            id="shipperAddress"
            name="shipperAddress"
            value={formData.shipperAddress || ''}
            onChange={handleChange}
            placeholder="Enter full address"
            className={errors.shipperAddress ? 'error' : ''}
          />
          {errors.shipperAddress && <span className="error-message">{errors.shipperAddress}</span>}
        </div>
      </div>

      <div className="booking-section">
        <h2 className="section-title">Receiver Information</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="receiverName">Receiver Name *</label>
            <input
              type="text"
              id="receiverName"
              name="receiverName"
              value={formData.receiverName || ''}
              onChange={handleChange}
              placeholder="Enter receiver name"
              className={errors.receiverName ? 'error' : ''}
            />
            {errors.receiverName && <span className="error-message">{errors.receiverName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="receiverCompany">Company</label>
            <input
              type="text"
              id="receiverCompany"
              name="receiverCompany"
              value={formData.receiverCompany || ''}
              onChange={handleChange}
              placeholder="Enter company name"
              className={errors.receiverCompany ? 'error' : ''}
            />
            {errors.receiverCompany && <span className="error-message">{errors.receiverCompany}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="receiverPhone">Phone Number *</label>
            <input
              type="tel"
              id="receiverPhone"
              name="receiverPhone"
              value={formData.receiverPhone || ''}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={errors.receiverPhone ? 'error' : ''}
            />
            {errors.receiverPhone && <span className="error-message">{errors.receiverPhone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="receiverEmail">Email *</label>
            <input
              type="email"
              id="receiverEmail"
              name="receiverEmail"
              value={formData.receiverEmail || ''}
              onChange={handleChange}
              placeholder="Enter email address"
              className={errors.receiverEmail ? 'error' : ''}
            />
            {errors.receiverEmail && <span className="error-message">{errors.receiverEmail}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="receiverAddress">Address *</label>
          <input
            type="text"
            id="receiverAddress"
            name="receiverAddress"
            value={formData.receiverAddress || ''}
            onChange={handleChange}
            placeholder="Enter full address"
            className={errors.receiverAddress ? 'error' : ''}
          />
          {errors.receiverAddress && <span className="error-message">{errors.receiverAddress}</span>}
        </div>
      </div>

      <div className="form-navigation">
        <div></div> {/* Empty div to maintain flex spacing */}
        <button 
          type="button" 
          className="next-button" 
          onClick={handleNextStep}
        >
          Next: Cargo Details
        </button>
      </div>
    </div>
  );
};

export default ShipperForm; 