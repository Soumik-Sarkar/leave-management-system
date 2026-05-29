const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const User = require("../models/User");

const AppError = require("../utils/AppError");

const registerUser = async (userData) => {
  const { name, email, password, role, employeeId } = userData;

  const existingUser = await User.findOne({
    $or: [{ email }, { employeeId }],
  });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    employeeId,
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
