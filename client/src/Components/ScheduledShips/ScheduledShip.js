import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ScheduledShip.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ScheduledShip = () => {
  const [fromPort, setFromPort] = useState('');
  const [toPort, setToPort] = useState('');
  const [date, setDate] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [schedulesWithEmissions, setSchedulesWithEmissions] = useState([]);
  const [sortByEmissions, setSortByEmissions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('point-to-point');
  const [dateError, setDateError] = useState('');
  const [ports, setPorts] = useState([]);
  const [bookingData, setBookingData] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Check if we have booking data from the location state
    if (location.state && location.state.fromBooking) {
      const { 
        originPort, 
        destinationPort, 
        preferredShippingDate, 
        cargoWeight,
        cargoQuantity,
        cargoType,
        isHazardous,
        requiresRefrigeration,
        bookingFormData
      } = location.state;
      
      setFromPort(originPort || '');
      setToPort(destinationPort || '');
      setDate(preferredShippingDate || today);
      setBookingData({
        cargoWeight,
        cargoQuantity,
        cargoType,
        isHazardous,
        requiresRefrigeration,
        bookingFormData
      });
      
      // Auto-search when coming from booking form
      setTimeout(() => {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) searchBtn.click();
      }, 1000);
    } else {
    setDate(today);
    }
    
    fetchSchedules();
    fetchPorts();
  }, [location]);

  // Effect to calculate emissions whenever filtered schedules change
  useEffect(() => {
    if (filteredSchedules.length > 0) {
      calculateEmissionsForSchedules();
    }
  }, [filteredSchedules, bookingData]);

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/ships/schedules`);
      setSchedules(response.data);
    } catch (error) {
      setError("Error fetching schedules. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPorts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/port`);
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
    } catch(error) {
      console.error("Error fetching ports:", error);
      setError("Error loading port data. Please try again.");
    }
  }

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

  // Helper function to get full port name with country
  const getFullPortName = (portName) => {
    if (!portName) return '';
    
    // First check if it already has country info
    if (portName.includes('(') && portName.includes(')')) {
      return cleanPortName(portName);
    }

    // Try to find the port with country info
    const portNameLower = portName.toLowerCase().trim();
    const matchedPort = ports.find(port => {
      // Get just the port name without country
      const listPortName = getPortNameOnly(port).toLowerCase();
      return listPortName === portNameLower;
    });

    return matchedPort ? cleanPortName(matchedPort) : portName;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (dateError) {
      return;
    }
    
    const filtered = schedules.filter((schedule) => {
      // Get port names without country information
      const inputFromPortName = getPortNameOnly(fromPort).toLowerCase();
      const inputToPortName = getPortNameOnly(toPort).toLowerCase();
  
      // Normalize schedule ports
      const scheduleStartingPort = schedule.startingPort?.trim().toLowerCase();
      const scheduleDestinationPort = schedule.destinationPort?.trim().toLowerCase();
      const scheduleIntermediatePorts = schedule.intermediatePorts?.map(port => port.trim().toLowerCase());
  
      // Check if fromPort matches startingPort or any intermediate port
      const matchesFromPort = !fromPort || 
        scheduleStartingPort === inputFromPortName || 
        scheduleIntermediatePorts?.includes(inputFromPortName);
  
      // Check if toPort matches destinationPort or any intermediate port
      const matchesToPort = !toPort || 
        scheduleDestinationPort === inputToPortName || 
        scheduleIntermediatePorts?.includes(inputToPortName);
  
      return matchesFromPort && matchesToPort;
    });
  
    setFilteredSchedules(filtered);
    
    if (filtered.length === 0) {
      setError("No schedules found matching your criteria. Please try different ports or dates.");
    } else {
      setError(null);
    }
  };

  // Function to calculate CO2 emissions for schedules
  const calculateEmissionsForSchedules = async () => {
    setIsLoading(true);
    try {
      // Create cargo data for emissions calculation - use actual data from booking form
      const cargoData = bookingData || {
        cargoWeight: 1, // Default to 1 kg if no booking data
        cargoQuantity: 1,
        cargoType: 'General',
        isHazardous: false,
        requiresRefrigeration: false
      };

      // Basic emissions calculation function in case the API call fails
      const calculateBasicEmissions = (ship, distance) => {
        // Basic calculation based on ship type, size, and distance
        const weight = parseFloat(cargoData.cargoWeight) || 1;
        
        // Default emissions factors by ship type (kg CO2 per ton-km)
        const factor = 0.02; // Average emissions factor
        
        return weight * distance * factor;
      };

      const schedulesWithEmissionsPromises = filteredSchedules.map(async (schedule) => {
        try {
          // Simple distance calculation between ports (simplified)
          const distance = 1000; // Default to 1000 km if can't calculate
          
          // If ship data is not available, use placeholder values
          if (!schedule.shipId) {
            return {
              ...schedule,
              co2Emissions: calculateBasicEmissions({shipType: 'Container'}, distance),
              emissionEfficiency: null,
              isOptimal: false
            };
          }

          // Try to get emissions from API
          const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/carbon-emissions/optimize`, {
            bookingId: null, // We're doing a calculation without an actual booking
            shipId: schedule.shipId._id,
            originPort: schedule.startingPort,
            destinationPort: schedule.destinationPort,
            cargoWeight: cargoData.cargoWeight,
            cargoQuantity: cargoData.cargoQuantity,
            cargoType: cargoData.cargoType,
            isHazardous: cargoData.isHazardous,
            requiresRefrigeration: cargoData.requiresRefrigeration,
            calculationOnly: true // Flag to indicate we just want the calculation
          });

          // Extract emissions data from response
          const emissionsData = response.data.data || {};
          
          return {
            ...schedule,
            co2Emissions: emissionsData.estimatedEmissions || calculateBasicEmissions(schedule.shipId, distance),
            emissionEfficiency: emissionsData.emissionEfficiency || null,
            isOptimal: emissionsData.isOptimal || false
          };
        } catch (error) {
          console.error(`Error calculating emissions for ship ${schedule.shipId?.shipName}:`, error);
          
          // Fallback to basic calculation
          const distance = 1000; // Default distance estimate
          const basicEmissions = calculateBasicEmissions(schedule.shipId || {shipType: 'Container'}, distance);
          
          return {
            ...schedule,
            co2Emissions: basicEmissions,
            emissionEfficiency: null,
            isOptimal: false
          };
        }
      });

      const schedulesWithEmissions = await Promise.all(schedulesWithEmissionsPromises);
      
      // Sort by emissions if enabled
      const sortedSchedules = sortByEmissions 
        ? [...schedulesWithEmissions].sort((a, b) => {
            // Handle null values
            if (a.co2Emissions === null) return 1;
            if (b.co2Emissions === null) return -1;
            return a.co2Emissions - b.co2Emissions;
          })
        : schedulesWithEmissions;
      
      // Mark the lowest emissions ship as optimal
      if (sortedSchedules.length > 0 && sortedSchedules[0].co2Emissions !== null) {
        sortedSchedules.forEach(s => s.isOptimal = false);
        sortedSchedules[0].isOptimal = true;
      }
      
      setSchedulesWithEmissions(sortedSchedules);
    } catch (error) {
      console.error("Error calculating emissions:", error);
      
      // Even in case of error, provide basic emissions estimates
      const basicSchedulesWithEmissions = filteredSchedules.map(schedule => {
        const distance = 1000; // Default distance
        const weight = parseFloat(bookingData?.cargoWeight || 1);
        const basicEmissions = weight * distance * 0.02; // Simple calculation
        
        return {
          ...schedule,
          co2Emissions: basicEmissions,
          emissionEfficiency: null,
          isOptimal: false
        };
      });
      
      // Sort and set optimal
      const sortedSchedules = [...basicSchedulesWithEmissions].sort((a, b) => a.co2Emissions - b.co2Emissions);
      if (sortedSchedules.length > 0) {
        sortedSchedules[0].isOptimal = true;
      }
      
      setSchedulesWithEmissions(sortedSchedules);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmissionsSort = () => {
    setSortByEmissions(!sortByEmissions);
    
    // Re-sort the existing schedules with emissions
    if (schedulesWithEmissions.length > 0) {
      const newSortedSchedules = [...schedulesWithEmissions];
      
      if (!sortByEmissions) {
        // Sort by emissions ascending
        newSortedSchedules.sort((a, b) => {
          if (a.co2Emissions === null) return 1;
          if (b.co2Emissions === null) return -1;
          return a.co2Emissions - b.co2Emissions;
        });
        
        // Mark the lowest emissions ship as optimal
        if (newSortedSchedules.length > 0 && newSortedSchedules[0].co2Emissions !== null) {
          newSortedSchedules.forEach(s => s.isOptimal = false);
          newSortedSchedules[0].isOptimal = true;
        }
      }
      
      setSchedulesWithEmissions(newSortedSchedules);
    }
  };

  const validateDate = (value) => {
    const selectedDate = new Date(value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to beginning of day
    
    if (selectedDate < currentDate) {
      return "Please select today or a future date";
    }
    return "";
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setDateError(validateDate(newDate));
  };

  const handleDateBlur = () => {
    setDateError(validateDate(date));
  };

  const handleSwapPorts = () => {
    setFromPort(toPort);
    setToPort(fromPort);
  };

  const handleBooking = (schedule) => {
    // Navigate to booking form with schedule details as state
    // For display to users, use the full port name with country

    // If we have booking data, continue the booking process with ship selection
    if (bookingData && bookingData.bookingFormData) {
      // Get the booking form data from our state
      const updatedFormData = {
        ...bookingData.bookingFormData,
        scheduleId: schedule._id,
        originPort: getFullPortName(schedule.startingPort),
        destinationPort: getFullPortName(schedule.destinationPort),
        preferredShippingDate: schedule.etd,
        preferredCarrier: schedule.shipId?.shipName || '',
        voyageNumber: schedule.voyageNumber,
        co2Emissions: schedule.co2Emissions,
        isOptimalEmissions: schedule.isOptimal,
        assignedShip: schedule.shipId?._id
      };
      
      // Start the booking process with payment
      initiateBookingWithPayment(updatedFormData, schedule);
    } else {
      // If no booking data, start a new booking form with this ship
      navigate('/ebookings', {
        state: {
          scheduleId: schedule._id,
          originPort: getFullPortName(schedule.startingPort),
          destinationPort: getFullPortName(schedule.destinationPort),
          preferredShippingDate: schedule.etd,
          preferredCarrier: schedule.shipId?.shipName || '',
          voyageNumber: schedule.voyageNumber,
          co2Emissions: schedule.co2Emissions,
          isOptimalEmissions: schedule.isOptimal
        }
      });
    }
  };
  
  // Process to initiate payment before creating booking
  const initiateBookingWithPayment = async (formData, schedule) => {
    setIsLoading(true);
    try {
      // Create a temporary booking to get an ID
      const bookingFormData = createBookingFormData(formData);
      
      // Calculate payment amount - using cargo value or a default amount
      const amount = (parseFloat(formData.cargoValue) * 100) || 5000 * 100; // in paise
      
      // Create Razorpay order
      const orderResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/payment/create-order`, {
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
          finalizeBookingWithPayment(formData, paymentData);
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
            setIsLoading(false);
            alert('Payment cancelled. Your booking was not completed.');
          }
        }
      };
      
      // Open Razorpay payment window
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert(`Error initiating payment: ${error.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };
  
  // Helper function to create form data
  const createBookingFormData = (formData) => {
    const bookingFormData = new FormData();
    
    // Add missing required fields with default values
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
    
    // Add document files if any
    if (formData.documents) {
      for (const docType in formData.documents) {
        if (formData.documents[docType]) {
          bookingFormData.append(`documents.${docType}`, formData.documents[docType]);
        }
      }
    }
    
    // Add carbon emissions data
    if (formData.co2Emissions) {
      bookingFormData.append('carbonEmissions.estimatedTotalEmissions', formData.co2Emissions);
      bookingFormData.append('carbonEmissions.optimizedRoute', formData.isOptimalEmissions);
    }
    
    return bookingFormData;
  };
  
  // Finalize booking after successful payment
  const finalizeBookingWithPayment = async (formData, paymentData) => {
    try {
      // Create the booking with form data
      const bookingFormData = createBookingFormData(formData);
      
      // Submit the booking
      const bookingResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking/bookings`, bookingFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (!bookingResponse.data.success) {
        throw new Error(bookingResponse.data.message || 'Error creating booking');
      }
      
      const bookingId = bookingResponse.data.data._id;
      
      // Verify payment and link it to the booking
      const verifyResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/payment/verify`, {
        bookingId,
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        signature: paymentData.signature,
        amount: paymentData.amount
      });
      
      if (!verifyResponse.data.success) {
        throw new Error('Payment verification failed');
      }
      
      // Show success message with option to download receipt
      Swal.fire({
        title: 'Booking Created!',
        text: 'Payment successful and your booking has been created with optimal ship selection based on CO2 emissions!',
        icon: 'success',
        confirmButtonText: 'Download Booking Receipt',
        showCancelButton: true,
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          // Generate PDF
          generatePDF(bookingResponse.data.data);
        }
        // Navigate to dashboard
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
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate PDF receipt for booking
  const generatePDF = (bookingData) => {
    const doc = new jsPDF();
    
    // Add company logo placeholder (this would be replaced with actual logo image)
    doc.setDrawColor(15, 55, 95); // Navy blue
    doc.setFillColor(15, 55, 95);
    doc.rect(20, 10, 30, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('ORACLE', 24, 18);
    doc.text('SHIPPING', 24, 22);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Add receipt title with styled background
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 30, 210, 12, 'F');
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text('BOOKING CONFIRMATION & PAYMENT RECEIPT', 105, 38, { align: 'center' });
    
    // Add reference number section with styling
    doc.setFillColor(245, 245, 245);
    doc.rect(140, 45, 50, 10, 'F');
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('REFERENCE NUMBER', 142, 51);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(bookingData._id || 'N/A', 142, 58);
    
    // Add date
    doc.setFillColor(245, 245, 245);
    doc.rect(140, 60, 50, 10, 'F');
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('DATE ISSUED', 142, 66);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(new Date().toLocaleDateString(), 142, 73);
    
    // Add shipper and receiver info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('SHIPPING INFORMATION', 20, 60);
    
    // Two-column layout for shipper and receiver
    // Shipper column
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text('SHIPPER', 20, 70);
    doc.setDrawColor(15, 55, 95);
    doc.line(20, 72, 55, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${bookingData.shipperName || 'N/A'}`, 20, 79);
    doc.text(`Email: ${bookingData.shipperEmail || 'N/A'}`, 20, 86);
    doc.text(`Phone: ${bookingData.shipperPhone || 'N/A'}`, 20, 93);
    doc.text(`Address: ${bookingData.shipperAddress || 'N/A'}`, 20, 100);
    
    // Receiver column
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text('RECEIVER', 110, 70);
    doc.line(110, 72, 150, 72);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${bookingData.receiverName || 'N/A'}`, 110, 79);
    doc.text(`Email: ${bookingData.receiverEmail || 'N/A'}`, 110, 86);
    doc.text(`Phone: ${bookingData.receiverPhone || 'N/A'}`, 110, 93);
    doc.text(`Address: ${bookingData.receiverAddress || 'N/A'}`, 110, 100);
    
    // Cargo and route details in a nice table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('CARGO & ROUTE DETAILS', 20, 115);
    
    // Create a styled table for cargo details
    doc.autoTable({
      startY: 120,
      head: [['Details', 'Value']],
      body: [
        ['Cargo Type', bookingData.cargoType || 'N/A'],
        ['Weight', `${bookingData.cargoWeight || 'N/A'} kg`],
        ['Quantity', bookingData.cargoQuantity || 'N/A'],
        ['Origin Port', bookingData.originPort || 'N/A'],
        ['Destination Port', bookingData.destinationPort || 'N/A'],
        ['Shipping Date', new Date(bookingData.preferredShippingDate || Date.now()).toLocaleDateString()],
        ['Service Type', bookingData.serviceType || 'Standard']
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 55, 95], 
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { left: 20, right: 20 }
    });
    
    // Add CO2 emissions information if available
    const tableEnd = doc.previousAutoTable.finalY + 10;
    
    if (bookingData.carbonEmissions && bookingData.carbonEmissions.estimatedTotalEmissions) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text('ENVIRONMENTAL IMPACT', 20, tableEnd);
      
      // Draw eco badge if optimized
      if (bookingData.carbonEmissions.optimizedRoute) {
        doc.setFillColor(200, 240, 200);
        doc.setDrawColor(0, 150, 0);
        doc.roundedRect(130, tableEnd - 8, 60, 15, 3, 3, 'FD');
        doc.setTextColor(0, 100, 0);
        doc.setFontSize(11);
        doc.text('🌿 ECO-FRIENDLY CHOICE', 160, tableEnd + 1, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      }
      
      // Create eco information box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 255, 245);
      doc.roundedRect(20, tableEnd + 10, 170, 35, 3, 3, 'FD');
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Estimated CO2 Emissions: ${bookingData.carbonEmissions.estimatedTotalEmissions.toFixed(2)} kg`, 30, tableEnd + 25);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text('This shipment has been optimized to reduce environmental impact.', 30, tableEnd + 35);
      if (bookingData.carbonEmissions.optimizedRoute) {
        doc.text('You\'ve chosen the most eco-friendly shipping option available for this route.', 30, tableEnd + 42);
      }
    }
    
    // Start Payment Information on new page
    doc.addPage();
    
    // Add page title with styling
    doc.setFillColor(15, 55, 95);
    doc.rect(0, 10, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    
    // Add booking reference
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Booking Reference: ${bookingData._id}`, 20, 40);
    
    // Add payment details section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('PAYMENT DETAILS', 20, 55);
    doc.line(20, 57, 100, 57);
    
    // Payment method and date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Payment Method:', 20, 65);
    doc.text('Razorpay', 80, 65);
    
    doc.text('Payment Date:', 20, 75);
    doc.text(new Date().toLocaleDateString(), 80, 75);
    
    doc.text('Transaction ID:', 20, 85);
    doc.text(bookingData.paymentId || 'Not Available', 80, 85);
    
    // Calculate payment amount
    const shippingCost = (parseFloat(bookingData.cargoValue) || parseFloat(bookingData.cargoWeight) * 50).toFixed(2);
    const taxAmount = (shippingCost * 0.18).toFixed(2);
    const totalAmount = (parseFloat(shippingCost) + parseFloat(taxAmount)).toFixed(2);
    
    // Create payment details table
    doc.autoTable({
      startY: 95,
      head: [['Description', 'Amount (₹)']],
      body: [
        ['Shipping Cost', shippingCost],
        ['GST (18%)', taxAmount],
        ['Insurance', '0.00'],
        ['Additional Services', '0.00']
      ],
      foot: [['Total Amount', totalAmount]],
      theme: 'grid',
      headStyles: { 
        fillColor: [15, 55, 95], 
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      footStyles: { 
        fillColor: [240, 240, 240], 
        textColor: [15, 55, 95], 
        fontStyle: 'bold' 
      },
      margin: { left: 20, right: 20 }
    });
    
    // Add terms and conditions
    const paymentTableEnd = doc.previousAutoTable.finalY + 15;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('TERMS AND CONDITIONS', 20, paymentTableEnd);
    doc.line(20, paymentTableEnd + 2, 130, paymentTableEnd + 2);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text('1. Please retain this receipt for future reference.', 20, paymentTableEnd + 12);
    doc.text('2. This receipt serves as proof of payment for your booking.', 20, paymentTableEnd + 19);
    doc.text('3. For any inquiries or changes to your booking, please contact our customer service.', 20, paymentTableEnd + 26);
    doc.text('4. Refund policy: Cancellations made 48 hours before shipping are eligible for a full refund.', 20, paymentTableEnd + 33);
    doc.text('5. Partial refunds may apply for cancellations made within 48 hours of shipping.', 20, paymentTableEnd + 40);
    
    // Add footer with contact information
    doc.setDrawColor(15, 55, 95);
    doc.setFillColor(15, 55, 95);
    doc.rect(0, 272, 210, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text('Oracle Shipping Ltd.', 105, 280, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text('123 Port Avenue, Mumbai, India | support@oracleshipping.com | +91 12345 67890', 105, 287, { align: 'center' });
    doc.text('Thank you for choosing Oracle Shipping - Your Eco-Friendly Shipping Partner', 105, 292, { align: 'center' });
    
    // Save the PDF with improved naming
    const cleanDate = new Date().toISOString().split('T')[0];
    doc.save(`Oracle-Shipping-Receipt-${bookingData._id}-${cleanDate}.pdf`);
  };

  // Old submit function will be replaced by the new payment flow
  const submitBookingWithShip = async (formData) => {
    setIsLoading(true);
    try {
      // This function is kept for backward compatibility
      // Create form data for submission
      const bookingFormData = createBookingFormData(formData);
      
      // Submit the booking
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/booking/bookings`, bookingFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Show success message
        alert('Booking created successfully with optimal ship selection based on CO2 emissions!');
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert(`Error creating booking: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if we're in booking mode or regular mode
  const isBookingMode = !!bookingData;

  return (
    <div className="scheduled-ship-container">
      <h1>{isBookingMode ? 'Select Ship by CO2 Emissions' : 'Schedules'}</h1>
      
      {isBookingMode && (
        <div className="booking-info-banner">
          <p>
            <strong>Cargo:</strong> {bookingData.cargoWeight} kg, {bookingData.cargoQuantity} unit(s), Type: {bookingData.cargoType}
          </p>
          <p>Find the most eco-friendly ship for your cargo below:</p>
        </div>
      )}
      
      {!isBookingMode && (
      <div className="scheduled-ship-search-container">
        <div className="scheduled-ship-tabs">
          {['point-to-point', 'vessel', 'arrivals/departures'].map((tab) => (
            <button
              key={tab}
              className={`scheduled-ship-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch}>
          {activeTab === 'point-to-point' && (
            <>
              <div className="scheduled-ship-input-group">
                <div className="scheduled-ship-input-wrapper">
                  <select
                    className="scheduled-ship-select"
                    value={fromPort}
                    onChange={(e) => setFromPort(e.target.value)}
                    required
                  >
                    <option value="">Select Origin Port</option>
                    {ports.map((port, index) => (
                      <option key={index} value={port}>{port}</option>
                    ))}
                  </select>
                </div>
                <button 
                  type="button" 
                  onClick={handleSwapPorts}  
                  className="scheduled-ship-swap-btn"
                >
                  <span className="material-icons">swap_horiz</span>
                </button>
                <div className="scheduled-ship-input-wrapper">
                  <select
                    className="scheduled-ship-select"
                    value={toPort}
                    onChange={(e) => setToPort(e.target.value)}
                    required
                  >
                    <option value="">Select Destination Port</option>
                    {ports.map((port, index) => (
                      <option key={index} value={port}>{port}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="scheduled-ship-date-wrapper">
                <input
                  className={`scheduled-ship-input ${dateError ? 'error' : ''}`}
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  onBlur={handleDateBlur}
                  min={today}
                  placeholder={today}
                  required
                />
                {dateError && <span className="error-message">{dateError}</span>}
              </div>
            </>
          )}
          <button 
            type="submit" 
            id="searchBtn" 
            className="scheduled-ship-search-btn" 
            disabled={isLoading || dateError}
          >
            {isLoading ? (
              <>
                <span className="loading-text">Searching</span>
                <span className="loading-dots">...</span>
              </>
            ) : (
              'Search Schedules'
            )}
          </button>
        </form>
      </div>
      )}
      
      {isBookingMode && (
        <div className="scheduled-ship-search-container booking-mode">
          <form onSubmit={handleSearch}>
            <button 
              type="submit" 
              id="searchBtn" 
              className="scheduled-ship-search-btn" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-text">Finding optimal ships</span>
                  <span className="loading-dots">...</span>
                </>
              ) : (
                'Find Optimal Ships'
              )}
            </button>
          </form>
        </div>
      )}
      
      {error && <p className="scheduled-ship-error-message">{error}</p>}
      
      {schedulesWithEmissions.length > 0 && (
        <div className="scheduled-ship-results-container">
          <div className="scheduled-ship-sorting-options">
            <button 
              className={`scheduled-ship-sort-btn ${sortByEmissions ? 'active' : ''}`}
              onClick={toggleEmissionsSort}
            >
              Sort by CO2 Emissions
            </button>
          </div>
          
          <div className="ship-cards-container">
            {schedulesWithEmissions.map((schedule, index) => {
              // Calculate transit time in days
              const etd = new Date(schedule.etd);
              const eta = new Date(schedule.eta);
              const transitDays = Math.round((eta - etd) / (1000 * 60 * 60 * 24));
              
              return (
                <div 
                  key={index} 
                  className={`ship-card ${schedule.isOptimal ? 'optimal-emissions' : ''}`}
                >
                  {schedule.isOptimal && (
                    <div className="recommended-badge">
                      <span className="recommended-text">RECOMMENDED</span>
                      <div className="eco-friendly-tag">
                        <span>🌿 Eco-Friendly Choice</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="ship-card-header">
                    <h3 className="ship-name">
                      {schedule.shipId?.shipName || 'N/A'}
                    </h3>
                    {schedule.voyageNumber ? (
                      <div className="voyage-number">Voyage: {schedule.voyageNumber}</div>
                    ) : null}
                  </div>
                  
                  <div className="ship-card-body">
                    <div className="ship-detail-row">
                      <div className="ship-detail-label">Route:</div>
                      <div className="ship-detail-value">{getPortNameOnly(schedule.startingPort)} → {getPortNameOnly(schedule.destinationPort)}</div>
                    </div>
                    
                    <div className="ship-detail-row">
                      <div className="ship-detail-label">Departure:</div>
                      <div className="ship-detail-value">{new Date(schedule.etd).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</div>
                    </div>
                    
                    <div className="ship-detail-row">
                      <div className="ship-detail-label">Arrival:</div>
                      <div className="ship-detail-value">{new Date(schedule.eta).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}</div>
                    </div>
                    
                    <div className="ship-detail-row">
                      <div className="ship-detail-label">Transit Time:</div>
                      <div className="ship-detail-value">
                        <span className="transit-days">{transitDays}</span> Days
                      </div>
                    </div>
                    
                    <div className="emissions-detail">
                      <div className="emissions-label">CO2 Emissions:</div>
                      <div className="emissions-value">
                        {schedule.co2Emissions ? `${schedule.co2Emissions.toFixed(2)} kg CO2e` : 'Not available'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ship-card-footer">
                    <button 
                      className={`ship-select-btn ${schedule.isOptimal ? 'eco-friendly' : ''}`}
                      onClick={() => handleBooking(schedule)}
                    >
                      {isBookingMode ? 'Select Ship' : 'Book Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledShip;
