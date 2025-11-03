const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// ===== SERIALIZE USER =====
// Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ===== DESERIALIZE USER =====
// Get user from database using ID stored in session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ===== GOOGLE STRATEGY =====
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔐 Google OAuth Attempt for:', profile.displayName);
    
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Check if user exists with same email (merge accounts)
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      user.googleId = profile.id;
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profilePhoto: profile.photos[0].value,
      lastLogin: new Date()
    });
    
    console.log('✅ New user created via Google OAuth:', user.name);
    done(null, user);
  } catch (error) {
    console.error('❌ Google OAuth Error:', error);
    done(error, null);
  }
}));

// ===== FACEBOOK STRATEGY =====
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔐 Facebook OAuth Attempt for:', profile.displayName);
    
    let user = await User.findOne({ facebookId: profile.id });
    
    if (user) {
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // Check by email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      user.facebookId = profile.id;
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    user = await User.create({
      facebookId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      profilePhoto: profile.photos[0].value,
      lastLogin: new Date()
    });
    
    console.log('✅ New user created via Facebook OAuth:', user.name);
    done(null, user);
  } catch (error) {
    console.error('❌ Facebook OAuth Error:', error);
    done(error, null);
  }
}));

// ===== GITHUB STRATEGY =====
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback",
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔐 GitHub OAuth Attempt for:', profile.displayName || profile.username);
    
    let user = await User.findOne({ githubId: profile.id });
    
    if (user) {
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    // GitHub might not return email in profile
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
    
    // Check by email (if available)
    user = await User.findOne({ email: email });
    
    if (user) {
      user.githubId = profile.id;
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }
    
    user = await User.create({
      githubId: profile.id,
      name: profile.displayName || profile.username,
      email: email,
      profilePhoto: profile.photos[0].value,
      lastLogin: new Date()
    });
    
    console.log('✅ New user created via GitHub OAuth:', user.name);
    done(null, user);
  } catch (error) {
    console.error('❌ GitHub OAuth Error:', error);
    done(error, null);
  }
}));

module.exports = passport;