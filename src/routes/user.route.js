const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authJwt");
const {
  createNewUser,
  getListUser,
  getUserById,
  changePassword,
} = require("../controllers/user.controller");

router.post('/create-user', authMiddleware, isAdmin, createNewUser);
router.get('/get-list-user', authMiddleware, getListUser);
router.get('/get-user/:id', authMiddleware, getUserById);
router.patch('/get-user/:id', authMiddleware, changePassword);

module.exports = router;