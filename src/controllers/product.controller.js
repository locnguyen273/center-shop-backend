const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../middlewares/validate-mongodb-id");
const db = require("../models");
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
    const { _id, __v, ...publicProduct } = product;
    if (product.id) {
      const parseProduct = {
        publicProduct,
        id: product._id,
      };
      res.status(200).send({
        status: true,
        data: publicProduct,
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

const updateOneProduct = asyncHandler(async (req, res) => {});

const deleteOneProduct = asyncHandler(async (req, res) => {});

module.exports = {
  createNewProduct,
  getListProduct,
  getOneProduct,
  updateOneProduct,
  deleteOneProduct,
};
