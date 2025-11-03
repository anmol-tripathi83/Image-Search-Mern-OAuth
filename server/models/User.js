const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // OAuth provider IDs
  googleId: { type: String, sparse: true },
  facebookId: { type: String, sparse: true },
  githubId: { type: String, sparse: true },
  
  // User profile information
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  profilePhoto: String,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

// Compound index to ensure unique provider IDs
userSchema.index({ googleId: 1 }, { sparse: true, unique: true });
userSchema.index({ facebookId: 1 }, { sparse: true, unique: true });
userSchema.index({ githubId: 1 }, { sparse: true, unique: true });

module.exports = mongoose.model('User', userSchema);