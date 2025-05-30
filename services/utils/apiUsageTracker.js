const redis = require('./redisClient');

const GOOGLE_API_COUNTER_KEY = 'google_api_usage';
const DAILY_QUOTA = parseInt(process.env.GOOGLE_API_DAILY_QUOTA || '1000');

async function canCallGoogleAPI() {
  try {
    const count = parseInt(await redis.get(GOOGLE_API_COUNTER_KEY)) || 0;
    return count < DAILY_QUOTA;
  } catch (e) {
    console.error("Redis error during canCallGoogleAPI:", e);
    // fallback to assuming quota exceeded to be safe
    return false;
  }
}

async function incrementGoogleAPIUsage() {
  const count = await redis.incr(GOOGLE_API_COUNTER_KEY);

  // Set TTL to 24 hours if first call
  if(count == 1) {
    await redis.expire(GOOGLE_API_COUNTER_KEY, 86400); // 24 hours in seconds
  }

  return count;
}

module.exports = {
  canCallGoogleAPI,
  incrementGoogleAPIUsage,
  GOOGLE_API_COUNTER_KEY
}