require('dotenv').config();



const config = {
  mongodbURI: process.env.MONGO_URI,
  port: process.env.PORT,
  env : process.env.ENV
};

module.exports = config;
