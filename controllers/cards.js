const mongoose = require('mongoose');
const Card = require('../models/card');
const { ERROR_BAD_DATA, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../utils/errors');

const cardDataUpdate = (req, res, updateData) => {
  Card.findByIdAndUpdate(req.params.cardId, updateData, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) res.send({ data: card });
      else res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные карточки.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      card.populate('owner')
        .then((newCard) => res.status(200).send(newCard))
        .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные карточки.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndRemove({ owner, _id: cardId })
    .then((card) => {
      if (card) res.send({ message: 'Карточка удалена' });
      else res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные карточки.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const updateData = { $addToSet: { likes: req.user._id } }; // добавить _id в массив
  cardDataUpdate(req, res, updateData);
};

module.exports.dislikeCard = (req, res) => {
  const updateData = { $pull: { likes: req.user._id } }; // убрать _id из массива
  cardDataUpdate(req, res, updateData);
};
