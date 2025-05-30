const { createClient } = require('redis');

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => console.log('Redis error', err));

// Connect to Redis
(async () => {
  await redis.connect();
})();

module.exports = redis;