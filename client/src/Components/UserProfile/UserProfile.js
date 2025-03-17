import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    street: '',
    postalCode: '',
    city: '',
    state: '',
    country: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const Base_URL = process.env.REACT_APP_BASE_URL;
  // const navigate = useNavigate();
  
  // Get user ID from local storage
  const userData = JSON.parse(localStorage.getItem('user'));
  const userId = userData.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${Base_URL}/api/auth/profile/${userId}`);
        console.log(response);
        setUserDetails(response.data); // Update user details state
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [Base_URL, userId]);

  const validateField = (name, value) => {
    let error = '';
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    // Validate all fields before submission
    Object.keys(userDetails).forEach((key) => {
      newErrors[key] = validateField(key, userDetails[key]);
    });
  
 
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const response = await axios.put(`${Base_URL}/api/auth/update-profile/${userId}`, userDetails);
      alert(response.data.message); 
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 'An error occurred. Please try again.';
        alert(errorMessage);
      } else {
        alert('Server error, please try again later.'); 
      }
    }
  };
  

  const renderField = (name, placeholder) => (
    <div className="mb-3">
      <input
        type="text"
        name={name}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={userDetails[name]}
        onChange={handleChange}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        {renderField('firstName', 'First Name')}
        {renderField('lastName', 'Last Name')}
        {renderField('email', 'Email')}
        {renderField('company', 'Company')}
        {renderField('street', 'Street')}
        {renderField('postalCode', 'Postal Code')}
        {renderField('city', 'City')}
        {renderField('state', 'State')}
        {renderField('country', 'Country')}
        {renderField('phone', 'Phone')}
        <button type="submit" className="update-button">Update Details</button>
      </form>
    </div>
  );
};

export default UserProfile;
