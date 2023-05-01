const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');
const { ERROR_BAD_DATA } = require('../utils/errors');

// eslint-disable-next-line max-len
const cardDataUpdate = (req, res, updateData, next) => { // общий метод для обновления данных пользователя в лайках
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) res.send({ data: card });
      else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      card.populate('owner')
        .then((newCard) => res.status(200).send(newCard));
    })
    .catch((err) => {
      // eslint-disable-next-line max-len
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные.' });
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена!');
      }
      if (String(card.owner) !== owner) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      }
      return Card.findByIdAndRemove(cardId)
        .then((delCard) => res.status(200).send(delCard))
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const updateData = { $addToSet: { likes: req.user._id } }; // добавить _id в массив
  cardDataUpdate(req, res, updateData, next);
};

module.exports.dislikeCard = (req, res, next) => {
  const updateData = { $pull: { likes: req.user._id } }; // убрать _id из массива
  cardDataUpdate(req, res, updateData, next);
};
