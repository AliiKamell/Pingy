const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");


// Function to get a list of all friends (users) from the database
const getAllFriends = asyncHandler(async (req, res) => {
  const users = await User.find(
    {}, // Find all users
    {
      __v: false,
      token: false,
    }
  );
  res.json({ status: 200, users });
});


// Function to register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); // Set HTTP status to 400 (Bad Request)
    throw new Error("Please Enter all the fields"); // Throw an error if fields are missing
  }

  // Check if a user with the same email already exists
  const userExistes = await User.findOne({ email });

  if (userExistes) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user
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


// Function to login a user
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
