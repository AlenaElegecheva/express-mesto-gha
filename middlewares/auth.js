// eslint-disable-next-line import/no-extraneous-dependencies
const token = require('jsonwebtoken');
const AuthorizationError = require('../error/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    throw new AuthorizationError('Необходима авторизация');
  }

  let payload;

  try {
    payload = token.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
