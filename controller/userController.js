import User from "../model/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

export const signup = async (req, res) => {
  try {
    const { username, email, pass, role } = req.body;
    if (!username || !email || !pass) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      username,
      email,
      pass,
      role,
    });
    const token = generateToken(newUser._id, newUser.role);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Internal server error!!", error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      res.status(400).json({
        message: "email and pass are required",
      });
    }
    const user = await User.findOne({ email }).select("+pass");
    if (!user) {
      res.status(400).json({
        message: "Invalid email or pass",
      });
    }
    const isPassCorrect = await user.matchpass(pass);
    if (!isPassCorrect) {
      return res.status(400).json({
        message: "Invalid email or pass",
      });
    }
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login error", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
