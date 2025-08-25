// external module
const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');

// local module
const siteRouter = require('./routes/siteRouter');
const workerRouter = require('./routes/workerRouter');
const expenseRouter = require('./routes/expenseRouter');
const managerRouter = require('./routes/managerRouter');

const errors = require('./controllers/errors');

// mongo connection string
const DB_PATH = 'mongodb+srv://root:shaktimaanMongo1@cluster1.ctvxcgv.mongodb.net/site_management?retryWrites=true&w=majority&appName=Cluster1'


const app = express();

// middlewere
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // only if you use form data
app.use("/uploads", express.static("uploads"));


// Routers
app.use('/',siteRouter)
app.use('/', workerRouter);
app.use('/', expenseRouter);
app.use('/', managerRouter);


// Error Handling
app.use(errors.getNotFound);


// Connect DB and start server

const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
  console.log("Database connected successfully");
  app.listen(PORT,() => {
    console.log(`http://localhost:${PORT}`);
  })
}).catch(error => {
  console.log("Error to connect database");
})
