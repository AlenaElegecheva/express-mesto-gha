const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards); // возвращает всех пользователей

router.post('/', celebrate({
  query: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard); // возвращает пользователя по _id

router.delete('/:cardId', celebrate({
  query: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard); // создаёт пользователя

router.put('/:cardId/likes', celebrate({
  query: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard); // поставить лайк карточке

router.delete('/:cardId/likes', celebrate({
  query: Joi.object().keys({
    _id: Joi.string().alphanum().length(24),
  }),
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard); // убрать лайк с карточки

module.exports = router;
