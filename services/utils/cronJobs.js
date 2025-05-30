const cron = require('node-cron');
const redis = require('./redisClient'); // Adjust path to your redis client
const { GOOGLE_API_COUNTER_KEY } = require('./apiUsageTracker'); // Or wherever you store keys
const logger = console; // Or your preferred logger
console.log("✅ Daily quota reset cron job initialized");
console.log("Server Time:", new Date().toString());
// Schedule cron job to run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  try {
    await redis.del(GOOGLE_API_COUNTER_KEY);
    logger.log(`[Cron Job] Google API usage counter reset at ${new Date().toISOString()}`);
  } catch (error) {
    logger.error(`[Cron Job] Failed to reset Google API usage counter:`, error);
    // TODO: Notify devs by email/slack or another alerting system here
  }
});
