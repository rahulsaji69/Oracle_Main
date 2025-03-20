const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // Skip file handling completely and prepare basic booking data
    const bookingPayload = {
      ...bookingData,
      files: undefined // Remove files from payload
    };

    // Proceed directly to payment
    try {
      // You might want to save booking details first
      const bookingResponse = await axios.post(
        'http://localhost:5000/api/booking/create-payment-intent',
        bookingPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const { clientSecret } = bookingResponse.data;

      // Redirect to payment page or open payment modal
      // Option 1: Using React Router
      navigate('/payment', { 
        state: { 
          clientSecret,
          bookingDetails: bookingPayload
        }
      });

      // Option 2: If using a payment modal
      // setPaymentModalOpen(true);
      // setPaymentIntent(clientSecret);

    } catch (paymentError) {
      console.error('Payment initialization failed:', paymentError);
      toast.error('Unable to proceed to payment. Please try again.');
    }

  } catch (error) {
    console.error('Submission error:', error);
    toast.error('Unable to process your booking');
  } finally {
    setLoading(false);
  }
};

const resetForm = () => {
  setBookingData({
    // Reset to your initial state structure
    files: [],
    // ... other fields
  });
  
  // If you have a file input ref
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
}; 