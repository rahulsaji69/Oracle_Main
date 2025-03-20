import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    // Shipper Information
    shipperName: '',
    shipperPhone: '',
    shipperEmail: '',
    shipperAddress: '',

    // Receiver Information
    receiverName: '',
    receiverPhone: '',
    receiverEmail: '',
    receiverAddress: '',

    // Updated Cargo Details
    containerType: '',
    containerSize: '',
    cargoType: '',
    cargoWeight: '',
    cargoDimensions: { length: '', width: '', height: '' },
    cargoQuantity: '',
    cargoValue: '',

    // Shipment Type
    serviceType: '',
    shippingClass: '',

    // Origin and Destination
    originPort: '',
    destinationPort: '',

    // Schedule and Route
    preferredShippingDate: '',
    preferredCarrier: '',

    // Insurance
    insuranceRequired: false,
    insuranceValue: '',

    // Special Handling
    specialInstructions: '',
    isFragile: false,
    requiresRefrigeration: false,
    isHazardous: false,

    // Payment Information
    paymentMethod: '',

    // Tracking and Notifications
    trackingPreference: '',

    // Customs Information
    hsCode: '',
    customsDocuments: [],

    // Additional Services
    additionalServices: [],

    // Document uploads
    documents: {
      billOfLading: null,
      commercialInvoice: null,
      packingList: null,
      customsDocuments: null,
      certificateOfOrigin: null
    },
  });
  const [dateError, setDateError] = useState('');
  const navigate = useNavigate();

  const Base_URL = process.env.REACT_APP_BASE_URL;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Set today's date as the initial value for preferredShippingDate
    setFormData(prevData => ({
      ...prevData,
      preferredShippingDate: today
    }));
  }, []);

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'containerType':
        if (!value) error = 'Container type is required';
        break;
      case 'containerSize':
        if (!value) error = 'Container size is required';
        break;
      case 'shipperName':
      case 'shipperPhone':
      case 'shipperEmail':
      case 'shipperAddress':
      case 'receiverName':
      case 'receiverPhone':
      case 'receiverEmail':
      case 'receiverAddress':
      case 'cargoType':
      case 'cargoWeight':
      case 'cargoQuantity':
      case 'cargoValue':
      case 'serviceType':
      case 'shippingClass':
      case 'originPort':
      case 'destinationPort':
      case 'preferredShippingDate':
      case 'paymentMethod':
      case 'trackingPreference':
        if (!value) error = 'This field is required';
        break;
      case 'cargoDimensions.length':
      case 'cargoDimensions.width':
      case 'cargoDimensions.height':
        if (!value) error = 'This dimension is required';
        break;
      case 'insuranceValue':
        if (formData.insuranceRequired && !value) {
          error = 'Insurance value is required when insurance is selected';
        }
        break;
      default:
        if (!value && name !== 'additionalServices') {
          error = 'This field is required';
        }
    }
    return error;
  };

  const validateDate = (value) => {
    const selectedDate = new Date(value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      return "Please select a future date";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'additionalServices') {
        const updatedServices = checked
          ? [...formData.additionalServices, value]
          : formData.additionalServices.filter(service => service !== value);
        setFormData({ ...formData, additionalServices: updatedServices });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else if (name.startsWith('cargoDimensions.')) {
      const dimension = name.split('.')[1];
      setFormData({
        ...formData,
        cargoDimensions: { ...formData.cargoDimensions, [dimension]: value }
      });
    } else if (type === 'date') {
      const error = validateDate(value);
      setDateError(error);
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      documents: {
        ...prevState.documents,
        [name]: files[0]
      }
    }));
  };

  const generateBill = (bookingDetails, paymentDetails) => {
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.text('OCEANORACLE SHIPPING', 105, 15, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 15, 30);
    doc.text(`Booking ID: ${bookingDetails._id}`, 15, 37);
    doc.text(`Payment ID: ${paymentDetails.paymentId}`, 15, 44);

    // Add shipper details
    doc.setFontSize(14);
    doc.text('Shipper Details:', 15, 55);
    doc.setFontSize(12);
    doc.text(`Name: ${bookingDetails.shipperName}`, 20, 62);
    doc.text(`Email: ${bookingDetails.shipperEmail}`, 20, 69);
    doc.text(`Phone: ${bookingDetails.shipperPhone}`, 20, 76);

    // Add cargo details
    doc.setFontSize(14);
    doc.text('Cargo Details:', 15, 90);
    
    // Create table for cargo details
    const cargoData = [
      ['Type', 'Weight', 'Quantity', 'Value'],
      [
        bookingDetails.cargoType,
        `${bookingDetails.cargoWeight} kg`,
        bookingDetails.cargoQuantity,
        `₹${bookingDetails.cargoValue}`
      ]
    ];

    doc.autoTable({
      startY: 95,
      head: [cargoData[0]],
      body: [cargoData[1]],
    });

    // Add payment details
    doc.setFontSize(14);
    doc.text('Payment Details:', 15, 140);
    doc.setFontSize(12);
    doc.text(`Amount Paid: ₹${paymentDetails.amount / 100}`, 20, 147);
    doc.text(`Payment Method: ${bookingDetails.paymentMethod}`, 20, 154);
    doc.text(`Payment Status: Successful`, 20, 161);

    // Add footer
    doc.setFontSize(10);
    doc.text('Thank you for choosing OCEANORACLE SHIPPING!', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`OCEANORACLE_Invoice_${bookingDetails._id}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key === 'cargoDimensions') {
        // Validate each dimension separately
        Object.keys(formData.cargoDimensions).forEach(dim => {
          const dimKey = `cargoDimensions.${dim}`;
          const error = validateField(dimKey, formData.cargoDimensions[dim]);
          if (error) formErrors[dimKey] = error;
        });
      } else if (key !== 'documents') {
        const error = validateField(key, formData[key]);
        if (error) formErrors[key] = error;
      }
    });

    // Check for validation errors
    if (Object.keys(formErrors).length > 0) {
      console.error('Form validation errors:', formErrors);
      
      // Show first error to the user
      const firstError = Object.values(formErrors)[0];
      Swal.fire({
        title: "Validation Error",
        text: firstError,
        icon: "error"
      });
      return;
    }

    // Validate date
    if (dateError) {
      Swal.fire({
        title: "Date Error",
        text: dateError,
        icon: "error"
      });
      return;
    }

    try {
      // Create FormData for file uploads
      const bookingFormData = new FormData();
      
      // Add all regular form fields
      Object.keys(formData).forEach(key => {
        if (key !== 'documents' && key !== 'cargoDimensions') {
          bookingFormData.append(key, formData[key]);
        }
      });
      
      // Add cargo dimensions
      bookingFormData.append('cargoDimensions', JSON.stringify(formData.cargoDimensions));
      
      // Add document files
      Object.keys(formData.documents).forEach(docType => {
        if (formData.documents[docType]) {
          bookingFormData.append(`documents.${docType}`, formData.documents[docType]);
        }
      });
      
      // Log form data for debugging (optional)
      console.log('Making API call to:', `${Base_URL}/api/booking/bookings`);
      // FormData can't be easily logged, so we skip logging the actual data
      
      // Make the API call with FormData
      const response = await axios.post(`${Base_URL}/api/booking/bookings`, bookingFormData, {
        timeout: 15000, // 15 seconds timeout
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Booking Successful:', response.data);
      
      // Continue with Razorpay order creation
      // Then create Razorpay order
      const orderResponse = await axios.post(
        `${Base_URL}/api/payment/create-order`,
        {
          amount: 10000 * 100, 
          bookingId: response.data.booking._id
        }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.order.amount,
        currency: "INR",
        name: "OCEANORACLE PAYMENT GATEWAY",
        description: "Booking Payment",
        order_id: orderResponse.data.order.id,
        handler: async function (razorpayResponse) {
          try {
            // Verify payment
            const verificationResponse = await axios.post(`${Base_URL}/api/payment/verify`, {
              bookingId: response.data.booking._id,
              paymentId: razorpayResponse.razorpay_payment_id,
              orderId: razorpayResponse.razorpay_order_id,
              signature: razorpayResponse.razorpay_signature,
              amount: orderResponse.data.order.amount
            });

            // Generate and download bill
            generateBill(response.data.booking, {
              paymentId: razorpayResponse.razorpay_payment_id,
              amount: orderResponse.data.order.amount
            });

            Swal.fire({
              title: "Payment successful!",
              text: "Booking confirmed and invoice has been downloaded",
              icon: "success"
            });
            
            navigate('/dashboard');
          } catch (error) {
            console.error('Payment verification failed:', error);
            Swal.fire({
              title: "Payment Error",
              text: "Payment verification failed. Please contact support.",
              icon: "error"
            });
          }
        },
        prefill: {
          name: formData.shipperName,
          email: formData.shipperEmail,
          contact: formData.shipperPhone
        },
        theme: {
          color: "#3399cc"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.response) {
        console.error('Error data:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      }
      
      alert(errorMessage);
    }
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Ship Booking Form</h2>
      
      <div className="form-section">
        <h3>Shipper Information</h3>
        <input type="text" name="shipperName" value={formData.shipperName} onChange={handleChange} placeholder="Shipper Name" required />
        <input type="tel" name="shipperPhone" value={formData.shipperPhone} onChange={handleChange} placeholder="Shipper Phone" required />
        <input type="email" name="shipperEmail" value={formData.shipperEmail} onChange={handleChange} placeholder="Shipper Email" required />
        <textarea name="shipperAddress" value={formData.shipperAddress} onChange={handleChange} placeholder="Shipper Address" required />
      </div>

      <div className="form-section">
        <h3>Receiver Information</h3>
        <input type="text" name="receiverName" value={formData.receiverName} onChange={handleChange} placeholder="Receiver Name" required />
        <input type="tel" name="receiverPhone" value={formData.receiverPhone} onChange={handleChange} placeholder="Receiver Phone" required />
        <input type="email" name="receiverEmail" value={formData.receiverEmail} onChange={handleChange} placeholder="Receiver Email" required />
        <textarea name="receiverAddress" value={formData.receiverAddress} onChange={handleChange} placeholder="Receiver Address" required />
      </div>

      <div className="form-section">
        <h3>Container Details</h3>
        <select 
          name="containerType" 
          value={formData.containerType} 
          onChange={handleChange} 
          required
        >
          <option value="">Select Container Type</option>
          <option value="dry">Dry Container</option>
          <option value="reefer">Reefer Container</option>
          <option value="open-top">Open Top Container</option>
          <option value="flat-rack">Flat Rack Container</option>
          <option value="tank">Tank Container</option>
        </select>

        <select 
          name="containerSize" 
          value={formData.containerSize} 
          onChange={handleChange} 
          required
        >
          <option value="">Select Container Size</option>
          <option value="20ft">20ft Standard</option>
          <option value="40ft">40ft Standard</option>
          <option value="40ft-hc">40ft High Cube</option>
        </select>

        <select 
          name="cargoType" 
          value={formData.cargoType} 
          onChange={handleChange} 
          required
        >
          <option value="">Select Cargo Type</option>
          <option value="general">General Cargo</option>
          <option value="perishable">Perishable Goods</option>
          <option value="dangerous">Dangerous Goods</option>
          <option value="valuable">Valuable Cargo</option>
        </select>

        <input type="number" name="cargoWeight" value={formData.cargoWeight} onChange={handleChange} placeholder="Cargo Weight (kg)" required />
        <input type="number" name="cargoDimensions.length" value={formData.cargoDimensions.length} onChange={handleChange} placeholder="Length (cm)" required />
        <input type="number" name="cargoDimensions.width" value={formData.cargoDimensions.width} onChange={handleChange} placeholder="Width (cm)" required />
        <input type="number" name="cargoDimensions.height" value={formData.cargoDimensions.height} onChange={handleChange} placeholder="Height (cm)" required />
        <input type="number" name="cargoQuantity" value={formData.cargoQuantity} onChange={handleChange} placeholder="Quantity" required />
        <input type="number" name="cargoValue" value={formData.cargoValue} onChange={handleChange} placeholder="Cargo Value" required />
      </div>

      <div className="form-section">
        <h3>Shipment Type</h3>
        <select name="serviceType" value={formData.serviceType} onChange={handleChange} required>
          <option value="">Select Service Type</option>
          <option value="door-to-door">Door to Door</option>
          <option value="port-to-port">Port to Port</option>
          <option value="door-to-port">Door to Port</option>
        </select>
        <select name="shippingClass" value={formData.shippingClass} onChange={handleChange} required>
          <option value="">Select Shipping Class</option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Origin and Destination</h3>
        <input type="text" id="originPort" name="originPort" value={formData.originPort} onChange={handleChange} placeholder="Origin Port" required />
        <input type="text" id="destinationPort" name="destinationPort" value={formData.destinationPort} onChange={handleChange} placeholder="Destination Port" required />
      </div>

      <div className="form-section">
        <h3>Schedule and Route</h3>
        <div className="date-input-wrapper">
          <input 
            type="date" 
            name="preferredShippingDate" 
            value={formData.preferredShippingDate} 
            onChange={handleChange} 
            min={today}
            required 
          />
          <label>Preferred Shipping Date</label>
          {dateError && <span className="error-message">{dateError}</span>}
        </div>
        <input type="text" id="preferredCarrier" name="preferredCarrier" value={formData.preferredCarrier} onChange={handleChange} placeholder="Preferred Carrier (optional)" />
      </div>

      <div className="form-section">
        <h3>Insurance</h3>
        <label>
          <input type="checkbox" id="insuranceRequired" name="insuranceRequired" checked={formData.insuranceRequired} onChange={handleChange} />
          Insurance Required
        </label>
        {formData.insuranceRequired && (
          <input type="number" id="insuranceValue" name="insuranceValue" value={formData.insuranceValue} onChange={handleChange} placeholder="Insurance Value" required />
        )}
      </div>

      <div className="form-section">
        <h3>Special Handling</h3>
        {formData.cargoType === 'dangerous' && (
          <div className="dangerous-goods-info">
            <input 
              type="text" 
              name="imdgClass" 
              value={formData.imdgClass || ''} 
              onChange={handleChange} 
              placeholder="IMDG Class" 
              required 
            />
            <input 
              type="text" 
              name="unNumber" 
              value={formData.unNumber || ''} 
              onChange={handleChange} 
              placeholder="UN Number" 
              required 
            />
          </div>
        )}
        <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Special Instructions" />
        <label>
          <input type="checkbox" name="isFragile" checked={formData.isFragile} onChange={handleChange} />
          Fragile Cargo
        </label>
        <label>
          <input type="checkbox" name="requiresRefrigeration" checked={formData.requiresRefrigeration} onChange={handleChange} />
          Requires Refrigeration
        </label>
        <label>
          <input type="checkbox" name="isHazardous" checked={formData.isHazardous} onChange={handleChange} />
          Hazardous Materials
        </label>
      </div>

      <div className="form-section">
        <h3>Payment Information</h3>
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
          <option value="">Select Payment Method</option>
          <option value="creditCard">Credit Card</option>
          <option value="bankTransfer">Bank Transfer</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Tracking and Notifications</h3>
        <select name="trackingPreference" value={formData.trackingPreference} onChange={handleChange} required>
          <option value="">Select Tracking Preference</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="both">Both Email and SMS</option>
        </select>
      </div>

      <div className="form-section">
        <h3>Customs Information</h3>
        <input type="text" name="hsCode" value={formData.hsCode} onChange={handleChange} placeholder="HS Code" />
        {/* You might want to add a file upload component here for customs documents */}
      </div>

      <div className="form-section">
        <h3>Additional Services</h3>
        <label>
          <input type="checkbox" id="customsClearance" name="additionalServices" value="customsClearance" checked={formData.additionalServices.includes('customsClearance')} onChange={handleChange} />
          Customs Clearance
        </label>
        <label>
          <input type="checkbox" id="packaging" name="additionalServices" value="packaging" checked={formData.additionalServices.includes('packaging')} onChange={handleChange} />
          Packaging
        </label>
        <label>
          <input type="checkbox" id="warehousing" name="additionalServices" value="warehousing" checked={formData.additionalServices.includes('warehousing')} onChange={handleChange} />
          Warehousing
        </label>
      </div>

      <div className="form-section">
        <h3>Required Documents</h3>
        <div className="document-upload-grid">
          <div className="document-upload-item">
            <label>Bill of Lading</label>
            <input
              type="file"
              name="billOfLading"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              required
            />
            {formData.documents.billOfLading && (
              <span className="file-name">{formData.documents.billOfLading.name}</span>
            )}
          </div>

          <div className="document-upload-item">
            <label>Commercial Invoice</label>
            <input
              type="file"
              name="commercialInvoice"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              required
            />
            {formData.documents.commercialInvoice && (
              <span className="file-name">{formData.documents.commercialInvoice.name}</span>
            )}
          </div>

          <div className="document-upload-item">
            <label>Packing List</label>
            <input
              type="file"
              name="packingList"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              required
            />
            {formData.documents.packingList && (
              <span className="file-name">{formData.documents.packingList.name}</span>
            )}
          </div>

          <div className="document-upload-item">
            <label>Customs Documentation</label>
            <input
              type="file"
              name="customsDocuments"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              required
            />
            {formData.documents.customsDocuments && (
              <span className="file-name">{formData.documents.customsDocuments.name}</span>
            )}
          </div>

          <div className="document-upload-item">
            <label>Certificate of Origin</label>
            <input
              type="file"
              name="certificateOfOrigin"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              required
            />
            {formData.documents.certificateOfOrigin && (
              <span className="file-name">{formData.documents.certificateOfOrigin.name}</span>
            )}
          </div>
        </div>
      </div>

      <button type="submit" id="submitBtn" className="submit-btn">Submit Booking</button>
    </form>
  );
};

export default BookingForm;
