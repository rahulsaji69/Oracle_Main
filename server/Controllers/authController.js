const User = require('../Models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, company, street, postalCode, city, state, country, phone } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      company,
      street,
      postalCode,
      city,
      state,
      country,
      phone,
      role: 'customer',
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ message: 'Account is disabled. Please contact support.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '10h' }
    );

    res.status(200).json({
      status: 1,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.firstName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { firstName, lastName, email, company, street, postalCode, city, state, country, phone } = req.body;
  const userId = req.params.id;

  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (company) user.company = company;
    if (street) user.street = street;
    if (postalCode) user.postalCode = postalCode;
    if (city) user.city = city;
    if (state) user.state = state;
    if (country) user.country = country;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company,
        street: user.street,
        postalCode: user.postalCode,
        city: user.city,
        state: user.state,
        country: user.country,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfileDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      company: user.company,
      street: user.street,
      postalCode: user.postalCode,
      city: user.city,
      state: user.state,
      country: user.country,
      phone: user.phone,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};