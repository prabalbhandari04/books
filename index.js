const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const morgan = require('morgan');

const app = express();
const PORT = config.port;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const userRouter = require('./routes/user.route')
const bookRouter = require('./routes/book.route');
const PurchaseRouter = require('./routes/purchase.route');

mongoose.connect(config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/book', bookRouter);
app.use('/api/v1/purchase', PurchaseRouter);

app.get('/', (req, res) => {
  const environmentMessage = `Server is running on http://localhost:${PORT} in ${config.env} environment.`;
  res.send(environmentMessage);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
