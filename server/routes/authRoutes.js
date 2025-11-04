const router = require('express').Router();
const passport = require('passport');

// GOOGLE AUTHENTICATION
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=authFailed` 
  }),
  (req, res) => {
    // Successful authentication
    console.log('Google OAuth successful for:', req.user.name);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// FACEBOOK AUTHENTICATION 
router.get('/facebook',
  passport.authenticate('facebook', { 
    scope: ['email', 'public_profile'] 
  })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=authFailed` 
  }),
  (req, res) => {
    console.log('Facebook OAuth successful for:', req.user.name);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// GITHUB AUTHENTICATION 
router.get('/github',
  passport.authenticate('github', { 
    scope: ['user:email'] 
  })
);

router.get('/github/callback',
  passport.authenticate('github', { 
    failureRedirect: `${process.env.CLIENT_URL}/login?error=authFailed` 
  }),
  (req, res) => {
    console.log('GitHub OAuth successful for:', req.user.name);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// ===== LOGOUT =====
router.get('/logout', (req, res, next) => {
  const userName = req.user ? req.user.name : 'Unknown User';
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log('User logged out:', userName);
    res.redirect(process.env.CLIENT_URL);
  });
});

// ===== GET CURRENT USER =====
router.get('/currentUser', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      message: 'No user session found'
    });
  }
  
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    profilePhoto: req.user.profilePhoto
  });
});

module.exports = router;