// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const User = require('../models/user');
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
    .catch(next);
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
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.send({ data: user });
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
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
      const userObj = user.toObject();
      delete userObj.password;
      res.status(200).send(userObj);
    })
    .catch(next);
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
      res.send({ token });
    })
    .catch(next);
};
