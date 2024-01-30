const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const morgan = require('morgan');

const app = express();
const PORT = config.port;

mongoose.connect(config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Route for the root path ("/")
app.get('/', (req, res) => {
  const environmentMessage = `Server is running on http://localhost:${PORT} in ${config.env} environment.`;
  res.send(environmentMessage);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
