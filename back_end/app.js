// external module
const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

// local module
const authRouter = require('./routes/authRouter');
const siteRouter = require('./routes/siteRouter');
const workerRouter = require('./routes/workerRouter');
const expenseRouter = require('./routes/expenseRouter');
const managerRouter = require('./routes/managerRouter');
const memoRouter = require('./routes/memoRouter');

const errors = require('./controllers/errors');
const { auth } = require('./middleware/auth');


const app = express();

// middlewere
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // only if you use form data
app.use("/uploads", express.static("uploads"));


// Routers
app.use('/auth',authRouter);
app.use('/sites',auth,siteRouter);
app.use('/workers',auth, workerRouter);
app.use('/expenses',auth, expenseRouter);
app.use('/managers',auth, managerRouter);
app.use('/memos',auth, memoRouter);


// Error Handling
app.use(errors.getNotFound);


// Connect DB and start server

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Database connected successfully");
  app.listen(port,() => {
    console.log(`http://localhost:${port}`);
  })
}).catch(error => {
  console.log("Error to connect database");
})
