import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingForm.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ShipperForm from './ShipperForm';
import CargoForm from './CargoForm';

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

    // Carbon Emissions
    co2Emissions: null,
    isOptimalEmissions: false,

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

  const [formStep, setFormStep] = useState(1); // 1 for ShipperForm, 2 for CargoForm, 3 for Ship Selection
  const [dateError, setDateError] = useState('');
  const [ports, setPorts] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const Base_URL = process.env.REACT_APP_BASE_URL;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Add shipData state if it's passed from the ship schedule
  const [shipData, setShipData] = useState(location.state?.shipData || null);

  // Make sure cargoDimensions is initialized properly
  useEffect(() => {
    // Initialize cargoDimensions if undefined
    if (!formData.cargoDimensions) {
      setFormData(prevData => ({
        ...prevData,
        cargoDimensions: { length: '', width: '', height: '' }
      }));
    }
  }, []);

  useEffect(() => {
    // If we have state from navigation, populate form fields
    if (location.state) {
      const { 
        scheduleId, 
        originPort, 
        destinationPort, 
        preferredShippingDate, 
        preferredCarrier, 
        voyageNumber,
        co2Emissions,
        isOptimalEmissions
      } = location.state;
      
      setFormData(prevData => ({
        ...prevData,
        originPort: originPort || '',
        destinationPort: destinationPort || '',
        preferredShippingDate: preferredShippingDate ? new Date(preferredShippingDate).toISOString().split('T')[0] : today,
        preferredCarrier: preferredCarrier || '',
        scheduleId: scheduleId || '',
        voyageNumber: voyageNumber || '',
        co2Emissions: co2Emissions || null,
        isOptimalEmissions: isOptimalEmissions || false
      }));
    } else {
      // Otherwise, just set today's date
      setFormData(prevData => ({
        ...prevData,
        preferredShippingDate: today
      }));
    }

    // Fetch ports
    fetchPorts();
  }, []);

  const fetchPorts = async () => {
    try {
      const response = await axios.get(`${Base_URL}/api/port`);
      // Clean all port names before setting them
      const cleanedPorts = (response.data.ports || []).map(port => {
        // Check for duplicate country pattern and clean it
        const duplicatePattern = /^(.+?)\(([^)]+)\)(?:\([^)]+\))+$/;
        if (duplicatePattern.test(port)) {
          const matches = port.match(/^(.+?)\(([^)]+)\)/);
          if (matches) {
            return `${matches[1].trim()}(${matches[2]})`;
          }
        }
        return port;
      });
      setPorts(cleanedPorts);
    } catch (error) {
      console.error('Error fetching ports:', error);
    }
  };

  // Helper function to clean port names by removing duplicate country information
  const cleanPortName = (portName) => {
    if (!portName) return '';
    
    // More comprehensive regex that handles any number of repeated country patterns
    // Matches: Mumbai(India)(India), Shanghai(China)(China)(China), etc.
    const duplicatePattern = /^(.+?)\(([^)]+)\)(?:\([^)]+\))+$/;
    if (duplicatePattern.test(portName)) {
      const matches = portName.match(/^(.+?)\(([^)]+)\)/);
      if (matches) {
        return `${matches[1].trim()}(${matches[2]})`;
      }
    }
    
    return portName;
  };

  // Helper function to extract port name without country
  const getPortNameOnly = (portWithCountry) => {
    // If port contains parentheses, extract just the port name
    const match = portWithCountry.match(/^(.+?)\([^)]+\)$/);
    return match ? match[1].trim() : portWithCountry.trim();
  };

  // Helper function to get port with country information
  const getFullPortName = (portName) => {
    if (!portName || !ports.length) return portName;
    
    // First check if it already has country info
    if (portName.includes('(') && portName.includes(')')) {
      return cleanPortName(portName);
    }
    
    // Try to find the full port name with country
    const portNameLower = portName.toLowerCase().trim();
    const matchedPort = ports.find(port => {
      // Get the port name without country
      const listPortName = getPortNameOnly(port).toLowerCase();
      return listPortName === portNameLower;
    });
    
    return matchedPort ? cleanPortName(matchedPort) : portName;
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'shipperName':
      case 'receiverName':
        if (!value) error = 'Name is required';
        break;
      case 'shipperPhone':
      case 'receiverPhone':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Please enter a valid 10-digit phone number';
        break;
      case 'shipperEmail':
      case 'receiverEmail':
        if (!value) error = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'shipperAddress':
      case 'receiverAddress':
        if (!value) error = 'Address is required';
        break;
      case 'containerType':
        if (!value) error = 'Container type is required';
        break;
      case 'containerSize':
        if (!value) error = 'Container size is required';
        break;
      case 'cargoType':
        if (!value) error = 'Cargo type is required';
        break;
      case 'cargoWeight':
        if (!value) error = 'Cargo weight is required';
        else if (isNaN(value) || Number(value) <= 0) error = 'Please enter a valid weight';
        break;
      case 'cargoQuantity':
        if (!value) error = 'Cargo quantity is required';
        else if (isNaN(value) || Number(value) <= 0) error = 'Please enter a valid quantity';
        break;
      case 'cargoValue':
        if (!value) error = 'Cargo value is required';
        else if (isNaN(value) || Number(value) <= 0) error = 'Please enter a valid value';
        break;
      case 'serviceType':
        if (!value) error = 'Service type is required';
        break;
      case 'shippingClass':
        if (!value) error = 'Shipping class is required';
        break;
      case 'originPort':
        if (!value) error = 'Origin port is required';
        break;
      case 'destinationPort':
        if (!value) error = 'Destination port is required';
        break;
      case 'preferredShippingDate':
        if (!value) error = 'Shipping date is required';
        else error = validateDate(value);
        break;
      case 'paymentMethod':
        if (!value) error = 'Payment method is required';
        break;
      case 'trackingPreference':
        if (!value) error = 'Tracking preference is required';
        break;
      case 'cargoDimensions.length':
      case 'cargoDimensions.width':
      case 'cargoDimensions.height':
        if (!value) error = 'This dimension is required';
        else if (isNaN(value) || Number(value) <= 0) error = 'Please enter a valid measurement';
        break;
      case 'insuranceValue':
        if (formData.insuranceRequired && !value) {
          error = 'Insurance value is required when insurance is selected';
        } else if (formData.insuranceRequired && (isNaN(value) || Number(value) <= 0)) {
          error = 'Please enter a valid insurance value';
        }
        break;
      default:
        if (!value && !['additionalServices', 'isFragile', 'requiresRefrigeration', 'isHazardous', 'insuranceRequired'].includes(name)) {
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
        // Special handling for the additionalServices array
        const additionalServices = [...formData.additionalServices];
        if (checked) {
          additionalServices.push(value);
        } else {
          const index = additionalServices.indexOf(value);
          if (index > -1) {
            additionalServices.splice(index, 1);
          }
        }
        setFormData(prevData => ({
          ...prevData,
          additionalServices
        }));
      } else {
        // Handle all other checkboxes
        setFormData(prevData => ({
          ...prevData,
          [name]: checked
        }));
      }
    } else if (name.startsWith('cargoDimensions.')) {
      // Handle nested cargoDimensions object
      const dimension = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        cargoDimensions: {
          ...prevData.cargoDimensions,
          [dimension]: value
        }
      }));
    } else {
      // Handle all other inputs
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }

    // Validate field
    const newErrors = { ...errors };
    newErrors[name] = validateField(name, type === 'checkbox' ? checked : value);
    setErrors(newErrors);
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      // Update documents object
      setFormData(prevData => ({
        ...prevData,
        documents: {
          ...prevData.documents,
          [name]: files[0]
        }
      }));
    }
  };

  const validateForm = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      // Validate shipper info
      ['shipperName', 'shipperPhone', 'shipperEmail', 'shipperAddress',
       'receiverName', 'receiverPhone', 'receiverEmail', 'receiverAddress'].forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });
    } else if (step === 2) {
      // Validate cargo info and shipping details
      ['containerType', 'containerSize', 'cargoType', 'cargoWeight',
       'cargoQuantity', 'cargoValue', 'serviceType', 'shippingClass',
       'originPort', 'destinationPort', 'preferredShippingDate',
       'paymentMethod', 'trackingPreference'].forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      // Validate cargo dimensions
      ['cargoDimensions.length', 'cargoDimensions.width', 'cargoDimensions.height'].forEach(field => {
        const dimension = field.split('.')[1];
        const error = validateField(field, formData.cargoDimensions[dimension]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      // Validate insurance value if insurance is required
      if (formData.insuranceRequired) {
        const error = validateField('insuranceValue', formData.insuranceValue);
        if (error) {
          newErrors.insuranceValue = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateForm(formStep)) {
      if (formStep === 2) {
        // Navigate to ship selection with cargo data
        navigateToShipSelection();
      } else {
        setFormStep(formStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    setFormStep(formStep - 1);
  };

  const navigateToShipSelection = () => {
    // Navigate to ship schedules with cargo data for CO2 calculations
    navigate('/shipschedules', { 
      state: {
        fromBooking: true,
        cargoWeight: parseFloat(formData.cargoWeight) || 0,
        cargoQuantity: parseInt(formData.cargoQuantity) || 1,
        cargoType: formData.cargoType,
        originPort: formData.originPort,
        destinationPort: formData.destinationPort,
        preferredShippingDate: formData.preferredShippingDate,
        isHazardous: formData.isHazardous,
        requiresRefrigeration: formData.requiresRefrigeration,
        bookingFormData: formData // Pass the entire form data for later use
      }
    });
  };

  // Process to initiate payment before creating booking
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(2)) {
      return;
    }
    
    try {
      // Calculate payment amount - using cargo value or a default amount based on weight
      const amount = (parseFloat(formData.cargoValue) * 100) || (parseFloat(formData.cargoWeight) * 50 * 100) || 5000 * 100; // in paise
      
      // Create Razorpay order
      const orderResponse = await axios.post(`${Base_URL}/api/payment/create-order`, {
        amount: amount,
        bookingId: 'TEMP-' + new Date().getTime() // Temporary ID for the order
      });
      
      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }
      
      // Get the order details
      const { id: orderId, amount_due: amountDue } = orderResponse.data.order;
      
      // Open Razorpay payment form
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amountDue,
        currency: "INR",
        name: "Oracle Shipping",
        description: "Booking Payment",
        order_id: orderId,
        handler: function (response) {
          // This function runs after successful payment
          const paymentData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: amountDue / 100, // Convert back to rupees
          };
          
          // Call function to create booking with payment verification
          finalizeBookingWithPayment(paymentData);
        },
        prefill: {
          name: formData.shipperName || "",
          email: formData.shipperEmail || "",
          contact: formData.shipperPhone || ""
        },
        notes: {
          shipping_route: `${formData.originPort} to ${formData.destinationPort}`,
          cargo_type: formData.cargoType,
          cargo_weight: formData.cargoWeight + " kg"
        },
        theme: {
          color: "#0f375f"
        },
        modal: {
          ondismiss: function() {
            Swal.fire({
              title: 'Payment Cancelled',
              text: 'Your booking was not completed because the payment was cancelled.',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
        }
      };
      
      // Open Razorpay payment window
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Error initiating payment:', error);
      // Show error message
      Swal.fire({
        title: 'Payment Error',
        text: error.response?.data?.message || 'Failed to initiate payment. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Finalize booking after successful payment
  const finalizeBookingWithPayment = async (paymentData) => {
    try {
      // Create form data for submission
      const bookingFormData = new FormData();
      
      // Add default values for required fields that were removed from UI
      const formDataWithDefaults = {
        ...formData,
        serviceType: formData.serviceType || 'port-to-port',
        shippingClass: formData.shippingClass || 'standard',
        paymentMethod: 'razorpay', // Set payment method to Razorpay
        trackingPreference: formData.trackingPreference || 'email'
      };
      
      // Add all form fields
      for (const key in formDataWithDefaults) {
        if (key !== 'documents' && key !== 'cargoDimensions') {
          bookingFormData.append(key, formDataWithDefaults[key]);
        }
      }
      
      // Add cargo dimensions
      for (const dim in formData.cargoDimensions) {
        bookingFormData.append(`cargoDimensions.${dim}`, formData.cargoDimensions[dim]);
      }
      
      // Add document files
      for (const docType in formData.documents) {
        if (formData.documents[docType]) {
          bookingFormData.append(`documents.${docType}`, formData.documents[docType]);
        }
      }
      
      // Submit the booking
      const bookingResponse = await axios.post(`${Base_URL}/api/booking/bookings`, bookingFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (!bookingResponse.data.success) {
        throw new Error(bookingResponse.data.message || 'Error creating booking');
      }
      
      const bookingId = bookingResponse.data.data._id;
      
      // Verify payment and link it to the booking
      const verifyResponse = await axios.post(`${Base_URL}/api/payment/verify`, {
        bookingId,
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        signature: paymentData.signature,
        amount: paymentData.amount
      });
      
      if (!verifyResponse.data.success) {
        throw new Error('Payment verification failed');
      }
      
      // Show success message
      Swal.fire({
        title: 'Booking Created!',
        text: 'Payment successful and your booking has been created.',
        icon: 'success',
        confirmButtonText: 'Download Booking Details',
        showCancelButton: true,
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          // Generate PDF
          generatePDF(bookingResponse.data.data);
        }
        // Navigate back to dashboard
        navigate('/dashboard');
      });
    } catch (error) {
      console.error('Error finalizing booking:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to create booking. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const generatePDF = (bookingData) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Booking Confirmation', 105, 15, { align: 'center' });
    
    // Add booking reference
    doc.setFontSize(12);
    doc.text(`Booking Reference: ${bookingData._id}`, 20, 30);
    
    // Add date
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
    
    // Add shipper and receiver info
    doc.text('Shipper Information:', 20, 55);
    doc.text(`Name: ${bookingData.shipperName}`, 30, 65);
    doc.text(`Email: ${bookingData.shipperEmail}`, 30, 75);
    doc.text(`Phone: ${bookingData.shipperPhone}`, 30, 85);
    
    doc.text('Receiver Information:', 20, 100);
    doc.text(`Name: ${bookingData.receiverName}`, 30, 110);
    doc.text(`Email: ${bookingData.receiverEmail}`, 30, 120);
    doc.text(`Phone: ${bookingData.receiverPhone}`, 30, 130);
    
    // Add cargo details
    doc.text('Cargo Details:', 20, 145);
    doc.text(`Type: ${bookingData.cargoType}`, 30, 155);
    doc.text(`Weight: ${bookingData.cargoWeight} kg`, 30, 165);
    doc.text(`Quantity: ${bookingData.cargoQuantity}`, 30, 175);
    
    // Add shipping details
    doc.text('Shipping Details:', 20, 190);
    doc.text(`Origin: ${bookingData.originPort}`, 30, 200);
    doc.text(`Destination: ${bookingData.destinationPort}`, 30, 210);
    doc.text(`Shipping Date: ${new Date(bookingData.preferredShippingDate).toLocaleDateString()}`, 30, 220);
    
    // Add CO2 emissions information if available
    if (bookingData.carbonEmissions && bookingData.carbonEmissions.estimatedTotalEmissions) {
      doc.text('Carbon Emissions:', 20, 235);
      doc.text(`Estimated CO2: ${bookingData.carbonEmissions.estimatedTotalEmissions.toFixed(2)} kg`, 30, 245);
      if (bookingData.carbonEmissions.optimizedRoute) {
        doc.text('Optimized eco-friendly route selected', 30, 255);
      }
    }
    
    // Save the PDF
    doc.save(`booking-confirmation-${bookingData._id}.pdf`);
  };

  // Add a component to display CO2 emissions information
  const EmissionsInfo = () => {
    if (!formData.co2Emissions) return null;
    
    return (
      <div className="emissions-info-container">
        <h3>Carbon Emissions Information</h3>
        <div className={`emissions-data ${formData.isOptimalEmissions ? 'optimal' : ''}`}>
          <p>
            <strong>Estimated CO2 Emissions:</strong> {formData.co2Emissions.toFixed(2)} kg
            {formData.isOptimalEmissions && (
              <span className="eco-badge">🌿 Most Eco-Friendly Option</span>
            )}
          </p>
          <p className="emissions-context">
            {formData.isOptimalEmissions 
              ? 'You have selected the most eco-friendly shipping option available for this route!' 
              : 'Consider checking ship schedules for more eco-friendly options.'}
          </p>
        </div>
      </div>
    );
  };

  // Add this function to handle going to ship selection
  const handleFindShips = () => {
    // First validate required cargo fields
    if (!formData.cargoWeight || !formData.cargoType || !formData.originPort || !formData.destinationPort || !formData.preferredShippingDate) {
      setErrors({ 
        ...errors, 
        generalError: "Please fill in all required cargo and port information before finding ships",
        cargoWeight: !formData.cargoWeight ? "Cargo weight is required" : "",
        cargoType: !formData.cargoType ? "Cargo type is required" : "",
        originPort: !formData.originPort ? "Origin port is required" : "",
        destinationPort: !formData.destinationPort ? "Destination port is required" : "",
        preferredShippingDate: !formData.preferredShippingDate ? "Shipping date is required" : ""
      });
      return;
    }

    // Navigate to ship schedules with cargo data
    navigate("/shipschedules", {
      state: {
        fromBooking: true,
        cargoWeight: parseFloat(formData.cargoWeight) || 0,
        cargoQuantity: parseInt(formData.cargoQuantity) || 1,
        cargoType: formData.cargoType,
        originPort: formData.originPort,
        destinationPort: formData.destinationPort,
        preferredShippingDate: formData.preferredShippingDate,
        isHazardous: formData.isHazardous,
        requiresRefrigeration: formData.requiresRefrigeration,
        bookingFormData: formData // Pass the entire form data for later use
      }
    });
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <h1>eBooking Form</h1>
        <div className="form-step-indicator">
          <div className="step-indicator">
            <div className={`step ${formStep >= 1 ? 'active' : ''} ${formStep > 1 ? 'completed' : ''}`}>1</div>
            <div className={`step-connector ${formStep > 1 ? 'active' : ''}`}></div>
            <div className={`step ${formStep >= 2 ? 'active' : ''}`}>2</div>
          </div>
          <div className="step-labels">
            <span className="step-label" style={{left: 'calc(25% - 30px)'}}>Shipper & Receiver</span>
            <span className="step-label" style={{left: 'calc(75% - 30px)'}}>Cargo & Shipping</span>
          </div>
        </div>
      </div>

      {/* Display error message if there's an issue with the form data */}
      {errors?.generalError && (
        <div className="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {errors.generalError}
        </div>
      )}

      {/* Conditional rendering with safety checks */}
      {formStep === 1 && (
        <ShipperForm
          formData={formData || {}}
          handleChange={handleChange}
          handleNextStep={handleNextStep}
          errors={errors || {}}
        />
      )}

      {formStep === 2 && formData && (
        <>
          <CargoForm
            formData={formData}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            validateField={validateField}
            handlePrevStep={handlePrevStep}
            handleSubmit={handleFindShips}
            submitButtonText="Find Optimal Ships"
            errors={errors || {}}
            ports={ports || []}
            dateError={dateError || ''}
            today={today}
          />
          {formData.co2Emissions && <EmissionsInfo />}
        </>
      )}

      {/* Find Ships Button */}
      {formStep === 1 && !shipData && (
        <button 
          className="find-ships-button" 
          onClick={handleFindShips}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          Find Available Ships
        </button>
      )}

      {/* Submit Button - Only show if ship data is available */}
      {shipData && (
        <button 
          className="next-button" 
          onClick={handleSubmit}
        >
          Submit Booking
        </button>
      )}
    </div>
  );
};

export default BookingForm;
