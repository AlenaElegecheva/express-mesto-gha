const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { ERROR_NOT_FOUND } = require('../utils/errors');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { LINK } = require('../utils/regex');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(LINK),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.all('*', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
