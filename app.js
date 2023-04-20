const express = require('express');
const mongoose = require('mongoose');
const rootRoute = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '643ea01de2d8108f2c98c457',
  };
  next();
});
app.use('/', rootRoute);

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);
