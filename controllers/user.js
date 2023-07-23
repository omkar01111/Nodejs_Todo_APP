import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";

import ErrorHandler from "../middlewares/error.js";

export const register = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    //Checking is user is already registered
    if (user) {
      return next(new ErrorHandler("User already exist", 404));
    }
    //for passwoed hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    // to save on database and stord in user
    user = await User.create({ name, email, password: hashedPassword });

    sendCookie(user, res, "Registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid username  and password", 404));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "password is incorrect" });
    }

    sendCookie(user, res, `welcome back ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })

    .json({
      success: true,
      user: req.user,
    });
};
