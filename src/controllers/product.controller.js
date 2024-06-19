const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../middlewares/validate-mongodb-id");
const db = require("../models");
const Product = db.product;

const createNewProduct = asyncHandler(async (req, res) => {

});

const getListProduct = asyncHandler(async (req, res) => {

});

const getOneProduct = asyncHandler(async (req, res) => {

});

const updateOneProduct = asyncHandler(async (req, res) => {

});

const deleteOneProduct = asyncHandler(async (req, res) => {

});

module.exports = {
  createNewProduct,
  getListProduct,
  getOneProduct,
  updateOneProduct,
  deleteOneProduct,
};