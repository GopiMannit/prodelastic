const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const { default: axios } = require('axios');
app.use(cors())
require('dotenv').config();
const pathRoutes = require('./routes/endpoint')
app.use(bodyParser.json({ limit: '35mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  })
)
const client = new Client({
  node: process.env.ELASTIC_SERVER_URL,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  },
  ssl: {
    rejectUnauthorized: false
  }
});
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
})
app.use('/api', pathRoutes)
app.listen(process.env.SERVER_PORT, () => {
  console.log("app running on the port >>> " + process.env.SERVER_PORT);
})