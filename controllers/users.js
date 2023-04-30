const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const User = require('../models/user');
const { ERROR_BAD_DATA, ERROR_CONFLICT_REQUEST } = require('../utils/errors');
const { NotFoundError } = require('../error/NotFoundError');

// eslint-disable-next-line max-len
const userDataUpdate = (req, res, updateData, next) => { // функция-декоратор для получения данных пользователя
  User.findByIdAndUpdate(
    req.user._id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) res.send({ data: user });
      else {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch((err) => {
      // eslint-disable-next-line max-len
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else {
        next(err);
      }
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) res.send({ data: user });
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.send({ data: user });
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      // eslint-disable-next-line max-len
      password: hash, // записываем хеш в базу. Метод принимает на вход два параметра: пароль и длину так называемой «соли» — случайной строки, которую метод добавит к паролю перед хешированем.
    }))
    .then((user) => {
      const dataUser = user.toObject();
      res.status(200).send(dataUser);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else if (err.code === 11000) {
        return res.status(ERROR_CONFLICT_REQUEST).send({
          message: 'Данный email уже зарегистрирован.',
        });
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const updateData = req.body;
  userDataUpdate(req, res, updateData);
};

module.exports.updateAvatar = (req, res) => {
  const updateData = req.body;
  userDataUpdate(req, res, updateData);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
    // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ token });
    })
    .catch(next);
};
