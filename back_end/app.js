// external module
const express = require('express');
const { default: mongoose } = require('mongoose');
const path = require('path');
const cors = require('cors');
const { data } = require('autoprefixer');
const errors = require('./controllers/errors');
const todoItemsRouter = require('./routes/todoItemsRouter');
const bodyParser = require('body-parser');
const DB_PATH = 'mongodb+srv://root:shaktimaanMongo1@cluster1.ctvxcgv.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster1'


const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(cors())
app.use(express.json())

app.use('/api/todo',todoItemsRouter)

app.use(errors.getNotFound);

const PORT = 3000;

mongoose.connect(DB_PATH).then(() => {
  console.log("Database connected successfully");
  app.listen(PORT,() => {
    console.log(`http://localhost:${PORT}`);
  })
}).catch(error => {
  console.log("Error to connect database");
})
