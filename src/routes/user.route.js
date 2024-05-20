const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authJwt");
const {
  createNewUser,
  getListUser,
} = require("../controllers/user.controller");

router.post('/create-user', authMiddleware, isAdmin, createNewUser);
router.get('/get-list-user', authMiddleware, getListUser);

module.exports = router;