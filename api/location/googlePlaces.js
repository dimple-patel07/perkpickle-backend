const express = require('express');
const router = express.Router();
const axios = require('axios');
const { canCallGoogleAPI, incrementGoogleAPIUsage } = require('../../services/utils/apiUsageTracker');
const { fetchFoursquarePlaces } = require('./foursquarePlaces');

router.get('/places', async(req, res) => {
  try {
    const { lat, lng } = req.query;
    const canCall = await canCallGoogleAPI();
    if(!canCall) {
      console.warn('⚠️ Google API quota exceeded. Using Foursquare fallback.');
      const fallbackData = await fetchFoursquarePlaces(lat, lng);
      return res.status(200).json({ source: 'foursquare', data: fallbackData });
    }

    await incrementGoogleAPIUsage();

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: process.env.RADIUS,
        key: process.env.GOOGLE_API_KEY
      }
    });

    res.status(200).json({ source: 'google', data: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error'});
  }
});

module.exports = router;