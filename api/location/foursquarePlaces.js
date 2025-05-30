const axios = require('axios');

async function fetchFoursquarePlaces(lat, lng) {
  try {
    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
      headers: {
        Authorization: process.env.FOURSQUARE_API_KEY
      },
      params: {
        ll: `${lat},${lng}`,
        radius: process.env.RADIUS || 100,
      }
    });

    return response.data; // could be .results depending on API version
  } catch (error) {
    console.error('❌ Error in Foursquare fallback:', error.message);
    return { error: 'Foursquare API failed.' };
  }
}

module.exports = { fetchFoursquarePlaces };
