const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-12147.c10.us-east-1-2.ec2.cloud.redislabs.com',
        port: 12147 
    }
});

module.exports = redisClient;