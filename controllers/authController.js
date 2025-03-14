import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // validation
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    // check user
    const existingUser = await userModel.findOne({ email });
    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    // Register user
    const hashedPassword = await hashPassword(password);
    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Registeration",
      error,
    });
  }
};

// Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    // check User
    const user = await userModel.findOne({
      email,
    });
    // Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }
    // ComparePassword
    const match = await comparePassword(password, user.password);
    // validation
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // Create Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login",
      error,
    });
  }
};

// forgot Password
export const forgotPasswordControllers = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    // Validation
    if (!email) {
      res.status(400).send({
        success: false,
        message: "Email is Required",
      });
    }
    if (!answer) {
      res.status(400).send({
        success: false,
        message: "Answer is Required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        success: false,
        message: "New Password is Required",
      });
    }

    // check Email and Answer
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
//test Routes
export const testController = (req, res) => {
  res.send("Protected Routes");
};
