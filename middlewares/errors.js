const { ERROR_DEFAULT } = require('../utils/errors');

// eslint-disable-next-line consistent-return
module.exports = ((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(ERROR_DEFAULT).send({
      message: 'Произошла ошибка',
    });
    return next();
  }
});
