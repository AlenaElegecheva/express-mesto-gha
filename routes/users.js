const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers); // возвращает всех пользователей

router.get('/:userId', getUserById); // возвращает пользователя по _id

router.post('/', createUser); // создаёт пользователя

router.patch('/me', updateUser); // обновляет профиль

router.patch('/me/avatar', updateAvatar); //  обновляет аватар

module.exports = router;
