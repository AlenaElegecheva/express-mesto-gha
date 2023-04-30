const Card = require('../models/card');
const { NotFoundError } = require('../error/NotFoundError');
const { ForbiddenError } = require('../error/ForbiddenError');

const cardDataUpdate = (req, res, updateData, next) => {
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
        .then((newCard) => res.status(200).send(newCard))
        .catch(next);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { id: cardId } = req.params;
  const { userId } = req.user;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner.valueOf() !== userId) throw new ForbiddenError('Вы пытаетесь удалить чужую карточку');
      card
        .remove()
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res) => {
  const updateData = { $addToSet: { likes: req.user._id } }; // добавить _id в массив
  cardDataUpdate(req, res, updateData);
};

module.exports.dislikeCard = (req, res) => {
  const updateData = { $pull: { likes: req.user._id } }; // убрать _id из массива
  cardDataUpdate(req, res, updateData);
};
