const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authJwt");
const {
  createNewProduct,
  getListProduct,
  getOneProduct,
  updateOneProduct,
  deleteOneProduct,
} = require("../controllers/product.controller");

router.post('/create-product', authMiddleware, isAdmin, createNewProduct);
router.get('/get-list-product', getListProduct);
router.get('/get-product/:id', getOneProduct);
router.patch('/get-product/:id', authMiddleware, isAdmin, updateOneProduct);
router.delete('/get-product/:id', authMiddleware, isAdmin, deleteOneProduct);

module.exports = router;