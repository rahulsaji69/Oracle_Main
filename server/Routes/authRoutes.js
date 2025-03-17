const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController')

router.post('/register',authController.registerUser );

router.post('/login', authController.loginUser);

router.get('/profile/:id', authController.getProfileDetails);

router.put('/update-profile/:id', authController.updateUserProfile);

// router.post('/send-otp-forget-password', authController.forGetPassWord);

// router.post('/forget-password', authController.)

module.exports = router