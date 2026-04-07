const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL)
}

module.exports = connectDB