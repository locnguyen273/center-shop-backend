const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../middlewares/validate-mongodb-id");
const db = require("../models");
const User = db.user;

const createNewUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, mobile, address } = req.body;
  const findUser = await User.findOne({ email: email });
  try {
    if (!email || !password || !fullName || !mobile || !address) {
      return res.status(400).send({
        status: false,
        message: "Không được bỏ trống các thông tin. Vui lòng tạo lại.",
      });
    } else if (!findUser) {
      const newUser = await User.create(req.body);
      res.status(201).send({
        status: true,
        message: "Đã tạo người dùng mới thành công.",
        data: newUser,
      });
    } else if (findUser) {
      return res.status(400).send({
        status: false,
        message: "Người dùng đã tồn tại. Vui lòng tạo lại.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
});

const getListUser = asyncHandler(async (req, res) => {
  const { currentPage, itemPerPage } = req.query;
  try {
    const totalUsers = await User.find().countDocuments();
    const listUser = await User.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemPerPage)
      .limit(itemPerPage);

    res.status(200).send({
      status: true,
      total: totalUsers,
      data: listUser,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    if (user.id) {
      const parseUser = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        isBlocked: user.isBlocked,
        cart: user.cart,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      res.status(200).send({
        status: true,
        data: parseUser,
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "Không tìm thấy người dùng.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;  
  validateMongoDbId(id);
  res.send({oldPassword, newPassword})
});

module.exports = {
  createNewUser,
  getListUser,
  getUserById,
  changePassword,
};
