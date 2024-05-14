const asyncHandler = require("express-async-handler");
const db = require("../models");
const User = db.user;

const registerUser = asyncHandler(async (req, res) => {
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

const loginUser = asyncHandler(async (req, res) => {

});

module.exports = {
  registerUser,
  loginUser,
};
