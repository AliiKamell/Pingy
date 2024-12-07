const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const getAllFriends = asyncHandler(async (req, res) => {
  const users = await User.find(
    {},
    {
      __v: false,
      token: false,
    }
  );
  res.json({ status: 200, users });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }
  const userExistes = await User.findOne({ email });

  if (userExistes) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
    await user.save();
  } else {
    res.status(400);
    throw new Error("Failed to create the user!");
  }
});

const login = (async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return next("Error: fill the feilds", error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return next("user not found", error);
  }

  const matchedPassword = password === user.password

  if (user && matchedPassword) {
    const token = await generateToken({
      email: user.email,
      id: user._id,
    });
    return res.json({
      status: "SUCCESS",
      data: { token: token },
    });
  } else {
    return next("user not found", error);
  }
});

module.exports = { registerUser, login, getAllFriends };
