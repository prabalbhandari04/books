const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRouter = require('./routes/user.route');
const bookRouter = require('./routes/book.route');
const purchaseRouter = require('./routes/purchase.route');

mongoose.connect(config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Swagger Options
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'BookStore Tech',
      version: '1.0.0',
      description: 'A backend service for users , authors and admins to crud books and purchase.',
    },
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/book', bookRouter);
app.use('/api/v1/purchase', purchaseRouter);

app.get('/', (req, res) => {
  const environmentMessage = `Server is running on http://localhost:${PORT} in ${config.env} environment.`;
  res.send(environmentMessage);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
