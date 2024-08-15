const asyncHandler = require("express-async-handler");
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
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  try {
    const totalUsers = await User.find().countDocuments();
    const listUser = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (!listUser) {
      res.status(404).send({
        status: false,
        message: "List user not found.",
      });
    }
    const sortedUsers = [...listUser].sort((a, b) =>
      a.fullName.localeCompare(b.fullName)
    );
    const filteredContacts = [...sortedUsers].sort(
      (a, b) => b.fullName - a.fullName
    );
    let listUserSort = [];
    filteredContacts.forEach((item) => {
      if (item) {
        const parseUser = {
          id: item._id,
          fullName: item.fullName,
          email: item.email,
          mobile: item.mobile,
          isBlocked: item.isBlocked,
          cart: item.cart,
          address: item.address,
          role: item.role,
          status: item.status,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
        listUserSort.push(parseUser);
      }
    });
    res.status(200).send({
      status: true,
      total: totalUsers,
      data: listUserSort,
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
        status: user.status,
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

const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const requestUpdate = {
    fullName: req?.body?.fullName,
    address: req?.body?.address,
    email: req?.body?.email,
    mobile: req?.body?.mobile,
    isBlocked: req?.body?.isBlocked,
    role: req?.body?.role,
    status: req?.body?.status,
  };
  try {
    const user = await User.findByIdAndUpdate(id, requestUpdate, { new: true });
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
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      res.status(200).send({
        status: true,
        message: "Cập nhật thông tin thành công.",
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

const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      const deleteOneUser = await User.findByIdAndDelete(id);
      res.status(200).send({
        status: true,
        message: "Đã xóa người dùng thành công.",
      });
    } else {
      return res.status(404).send({
        status: false,
        message: "Không tìm thấy người dùng.",
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  res.send({ oldPassword, newPassword });
});

module.exports = {
  createNewUser,
  getListUser,
  getUserById,
  changePassword,
  updateUserById,
  deleteUserById,
};
