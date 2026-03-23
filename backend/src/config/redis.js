const redis = require('redis');

const client = redis.createClient({ 
  url: process.env.REDIS_URL || 'redis://redis:6379' 
}); 

client.on('error', (err) => console.log('Redis Client Error', err));

client.on('ready', () => console.log('Redis Client Ready'));

module.exports = client;
