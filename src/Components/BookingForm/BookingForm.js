const verificationResponse = await axios.post(
  `${process.env.REACT_APP_API_URL}/api/verify-booking`,
  bookingData
);
const { data } = verificationResponse;

useEffect(() => {
  // ... existing code ...
}, [today]);