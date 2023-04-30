const mongoose = require('mongoose');
const { ERROR_BAD_DATA, ERROR_CONFLICT_REQUEST, ERROR_DEFAULT } = require('../utils/errors');

module.exports = ((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(ERROR_BAD_DATA).send({
      message: 'Переданы некорректные данные.',
    });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(ERROR_BAD_DATA).send({
      message: 'Передан некорректный ID',
    });
  }
  if (err.code === 11000) {
    return res.status(ERROR_CONFLICT_REQUEST).send({
      message: 'Данный email уже зарегистрирован.',
    });
  }
  res.status(ERROR_DEFAULT).send({
    message: 'Произошла ошибка',
  });
  return next();
});
