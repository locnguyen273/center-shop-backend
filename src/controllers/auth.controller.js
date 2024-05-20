const asyncHandler = require("express-async-handler");
const db = require("../models");
const { generateRefreshToken } = require("../configs/refreshToken");
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
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });
  try {
    if(userFound && (await userFound.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(userFound?._id);
      const userUpdated = await User.findByIdAndUpdate(
        userFound.id, { refreshToken }, { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      const userInfo = {
        id: userFound._id,
        fullName: userFound.fullName,
        email: userFound.email,
        role: userFound?.role,
        mobile: userFound?.mobile,
        address: userFound?.address,
        cart: userFound?.cart,
        token: generateRefreshToken(userFound?._id),
      }
      res.status(200).send({
        status: true,
        message: "Đăng nhập thành công.",
        data: userInfo
      })
    } else {
      return res.status(400).send({
        status: false,
        message: "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại sau.",
      });
    }
  } catch(err) {
    return res.status(400).send({
      status: false,
      message: err.message,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
};
