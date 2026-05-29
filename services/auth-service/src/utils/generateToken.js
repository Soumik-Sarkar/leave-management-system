const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      employeeId: user.employeeId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

module.exports = generateToken;
