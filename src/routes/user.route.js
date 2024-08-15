const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin, validateMongoDbId } = require("../middlewares/index");
const {
  createNewUser,
  getListUser,
  getUserById,
  changePassword,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller");

router.post('/create-user', authMiddleware, isAdmin, createNewUser);
router.get('/get-list-user', authMiddleware, getListUser);
router.get('/get-user/:id', validateMongoDbId, authMiddleware, getUserById);
router.patch('/get-user/:id', validateMongoDbId, authMiddleware, updateUserById);
router.delete('/get-user/:id', validateMongoDbId, authMiddleware, isAdmin, deleteUserById);
router.patch('/change-password/:id', validateMongoDbId, authMiddleware, changePassword);

module.exports = router;