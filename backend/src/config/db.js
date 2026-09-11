const mongoose = require('mongoose');
const dns = require('dns');


dns.setServers(['8.8.8.8', '1.1.1.1']);

async function main() {
    await mongoose.connect(process.env.DB_CONNECT_STRING)
}

module.exports = main;




