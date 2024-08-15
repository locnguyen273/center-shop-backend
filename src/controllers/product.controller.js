const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../middlewares/isValidId");
const db = require("../models");
const { default: slugify } = require("slugify");
const Product = db.product;

const createNewProduct = asyncHandler(async (req, res) => {
  const { name, category, isActive, details, imagesBanner, imagesDetails } =
    req.body;
  const findProduct = await Product.findOne({ name });
  try {
    if (
      !name ||
      !category ||
      !isActive ||
      !details ||
      !imagesBanner ||
      !imagesDetails
    ) {
      return res.status(400).send({
        status: false,
        message: "Không được bỏ trống các thông tin. Vui lòng tạo lại.",
      });
    } else if (!findProduct) {
      const newProduct = await Product.create(req.body);
      res.status(201).send({
        status: true,
        message: "Đã tạo sản phẩm mới thành công.",
        data: newProduct,
      });
    } else if (findProduct) {
      return res.status(400).send({
        status: false,
        message: "Sản phẩm đã tồn tại. Vui lòng tạo lại.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
});

const getListProduct = asyncHandler(async (req, res) => {
  const { currentPage, itemPerPage } = req.query;
  try {
    const totalProducts = await Product.find().countDocuments();
    const listProduct = await Product.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemPerPage)
      .limit(itemPerPage);

    res.status(200).send({
      status: true,
      total: totalProducts,
      data: listProduct,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
});

const getOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const product = await Product.findById(id);
    if (product.id) {
      res.status(200).send({
        status: true,
        data: product,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "Không tìm thấy sản phẩm.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
});

const updateOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if(req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.send({
      message: "Đã cập nhật sản phẩm thành công.",
      data: updateProduct,
    });
  } catch(error) {
    throw new Error(error);
  }
});

const deleteOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const product = await Product.findById(id);
    if(product) {
      const deleteProduct = await Product.findOneAndDelete(id);
      res.send({
        message: "Đã xóa sản phẩm thành công.",
      });
    } else res.status(404).send({
      message: "Sản phẩm không tồn tại.",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createNewProduct,
  getListProduct,
  getOneProduct,
  updateOneProduct,
  deleteOneProduct,
};
