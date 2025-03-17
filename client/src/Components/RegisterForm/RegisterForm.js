import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
  const navigate = useNavigate(); // Initialize useNavigate

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'company':
      case 'city':
      case 'state':
        if (!value.trim()) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else if (/[\d]/.test(value)) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} cannot contain numbers`;
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Confirm Password is required';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'postalCode':
        if (!value) {
          error = 'Postal Code is required';
        } else if (!/^[1-9]\d{5}$/.test(value) || value.startsWith('123')) {
          error = 'Postal Code must be exactly 6 digits ';
        }
        break;
      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^[1-9]\d{9}$/.test(value) || value.startsWith('12345')) {
          error = 'Phone number must be exactly 10 digits ';
        } else if (/^(.)\1{9}$/.test(value)) {
          error = 'Phone number cannot be all the same digit';
        }
        break;
      case 'street':
        if (!value.trim()) {
          error = 'Street is required';
        } else if (!/^[a-zA-Z\s]+[0-9]+$/.test(value)) {
          error = 'Street must be followed by a number';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(`${Base_URL}/api/auth/register`, formData);
        console.log('Registration Successful:', response);
        alert('User registered successfully!'); // Show success message
        navigate('/login'); // Redirect to login page
      } catch (error) {
        console.error('Registration error:', error);
      }
    }
  };

  const renderField = (name, placeholder, type = 'text') => (
    <div className="mb-3">
      <input
        type={type}
        name={name}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
      />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia','India','Brazil','Japan','China','South Africa'];

  const renderCountryDropdown = () => (
    <div className="mb-3">
      <select
        name="country"
        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
        value={formData.country}
        onChange={handleChange}
      >
        <option value="">Select Country</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>   
      {errors.country && <div className="invalid-feedback">{errors.country}</div>}
    </div>
  );

  return (
    <div className="background">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          {renderField('firstName', 'First Name')}
          {renderField('lastName', 'Last Name')}
          {renderField('email', 'Email', 'email')}
          {renderField('password', 'Password', 'password')}
          {renderField('confirmPassword', 'Confirm Password', 'password')}
          {renderField('company', 'Company')}
          {renderField('street', 'Street and Number')}
          {renderCountryDropdown()}
          <div className="row mb-3">
            <div className="col-md-4">
              {renderField('postalCode', 'Postal Code')}
            </div>
            <div className="col-md-4">
              {renderField('city', 'City')}
            </div>
            <div className="col-md-4">
              {renderField('state', 'State')}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              {renderField('phone', 'Phone')}
            </div>
          </div>
          <button type="submit" className="register1">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
