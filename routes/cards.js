const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards); // возвращает всех пользователей

router.post('/', createCard); // возвращает пользователя по _id

router.delete('/:cardId', deleteCard); // создаёт пользователя

router.put('/:cardId/likes', likeCard); // поставить лайк карточке

router.delete('/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
