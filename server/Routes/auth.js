const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Other auth routes like login, register, etc.

// Logout endpoint
router.post('/logout', auth, async (req, res) => {
  try {
    // If you're using a token blacklist or session store, invalidate the token
    // Example with Redis:
    // await redisClient.set(`bl_${req.user.id}`, req.token, 'EX', 24 * 60 * 60);
    
    // For JWT without a blacklist, we rely on the client to remove the token
    // The auth middleware ensures only authenticated users can access this endpoint
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = router; 