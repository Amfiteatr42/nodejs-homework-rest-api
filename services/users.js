const User = require("./usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (body) => {
  const user = new User(body);

  const hashedPass = bcrypt.hash(body.password, 10).then((hash) => {
    return hash;
  });

  user.password = await hashedPass;
  await user.save();

  return user;
};

const verifyUser = async (body) => {
  const user = await User.findOne({ email: body.email });
  if (!user) {
    return false;
  }

  const match = await bcrypt.compare(body.password, user.password);
  if (!match) {
    return false;
  }

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);

  await User.findByIdAndUpdate(user._id, { token: token });
  const updatedUser = await User.findById(user._id);

  return updatedUser;
};

// const removeToken = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     res.status(401).json({ message: "Not authorized" });
//     return;
//   }

//   await User.findByIdAndUpdate(userId, { token: null });
// };

module.exports = { createUser, verifyUser };
