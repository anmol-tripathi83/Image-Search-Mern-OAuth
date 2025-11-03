const router = require('express').Router();
const axios = require('axios');
const requireAuth = require('../middleware/authMiddleware');
const SearchHistory = require('../models/SearchHistory');

// Apply authentication middleware to all API routes
router.use(requireAuth);

// ===== TOP SEARCHES ENDPOINT =====
// GET /api/topSearches
router.get('/topSearches', async (req, res) => {
  try {
    console.log('📊 Fetching top searches...');
    
    const topSearches = await SearchHistory.aggregate([
      {
        $group: {
          _id: '$term',
          count: { $sum: 1 },
          lastSearched: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1, lastSearched: -1 } },
      { $limit: 5 }
    ]);
    
    // Format the response
    const formattedSearches = topSearches.map(item => ({
      term: item._id,
      count: item.count,
      lastSearched: item.lastSearched
    }));
    
    console.log('✅ Top searches fetched successfully');
    res.json(formattedSearches);
  } catch (error) {
    console.error('❌ Top searches error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top searches' 
    });
  }
});

// ===== SEARCH ENDPOINT =====
// POST /api/search
router.post('/search', async (req, res) => {
  try {
    const { term } = req.body;
    
    if (!term || term.trim() === '') {
      return res.status(400).json({ 
        error: 'Search term is required' 
      });
    }
    
    const searchTerm = term.trim().toLowerCase();
    console.log(`🔍 Search request for: "${searchTerm}" by user: ${req.user.name}`);
    
    // Save search history
    const searchHistory = new SearchHistory({
      userId: req.user._id,
      term: searchTerm
    });
    await searchHistory.save();
    
    // Call Unsplash API
    const unsplashResponse = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: {
          query: searchTerm,
          per_page: 20,
          page: 1
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    // Update search history with result count
    searchHistory.resultCount = unsplashResponse.data.results.length;
    await searchHistory.save();
    
    // Format the response
    const images = unsplashResponse.data.results.map(image => ({
      id: image.id,
      urls: {
        thumb: image.urls.thumb,
        small: image.urls.small,
        regular: image.urls.regular,
        full: image.urls.full
      },
      altDescription: image.alt_description,
      description: image.description,
      user: {
        name: image.user.name,
        username: image.user.username,
        profileImage: image.user.profile_image?.small
      },
      likes: image.likes,
      width: image.width,
      height: image.height
    }));
    
    console.log(`✅ Search completed: ${images.length} images found for "${searchTerm}"`);
    
    res.json({
      term: searchTerm,
      total: unsplashResponse.data.total,
      totalPages: unsplashResponse.data.total_pages,
      results: images
    });
    
  } catch (error) {
    console.error('❌ Search error:', error);
    
    if (error.response) {
      // Unsplash API error
      res.status(error.response.status).json({
        error: 'Unsplash API error',
        message: 'Failed to fetch images from Unsplash'
      });
    } else {
      res.status(500).json({ 
        error: 'Search failed',
        message: 'Unable to process search request'
      });
    }
  }
});

// ===== SEARCH HISTORY ENDPOINT =====
// GET /api/history
router.get('/history', async (req, res) => {
  try {
    console.log(`📚 Fetching search history for user: ${req.user.name}`);
    
    const history = await SearchHistory.find({ 
      userId: req.user._id 
    })
    .sort({ timestamp: -1 })
    .limit(20)
    .lean();
    
    // Format the response
    const formattedHistory = history.map(item => ({
      id: item._id,
      term: item.term,
      timestamp: item.timestamp,
      resultCount: item.resultCount
    }));
    
    console.log(`✅ History fetched: ${formattedHistory.length} search records`);
    res.json(formattedHistory);
  } catch (error) {
    console.error('❌ History fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch search history' 
    });
  }
});

module.exports = router;