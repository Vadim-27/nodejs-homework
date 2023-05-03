const { User } = require('../models/user');
const bcrypt = require("bcrypt");
const { ctrlWrapper } = require('../utils');
const { HttpError, sendEmail } = require('../helpers')
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require("jimp");
const { nanoid } = require('nanoid');



const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, '..', 'public', 'avatars');


const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verification",
    html: `<a target="_blank" href=${BASE_URL}/api/users/verify/${verificationToken}>Click to verify<a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: result.email,
    password: result.password,
    subscription: result.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Email verify success",
  });
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(404, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verification",
    html: `<a target="_blank" href=${BASE_URL}/api/users/verify/${user.verificationToken}>Click to verify<a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Email resend success",
  });
};



const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if (!user) {
        throw HttpError(401, 'Email or user invalid')
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or user invalid");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    await User.findByIdAndUpdate(user._id, { token });
    res.status(201).json({
        token,
    })
}

const changeSubscription = async (req, res) => {
    const { id } = req.params;
    

  const result = await User.findByIdAndUpdate(id, req.body, { new: true });
console.log(result, "result")
  if (!result) {
    throw HttpError(404, `"message": "Not found"`);
  }
  res.json(result);
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success. No Content",
  });
};


const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  const avatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarDir, avatarName);
  const optimizeAvatar = await Jimp.read(tempUpload);

    optimizeAvatar.resize(256, 256).write(resultUpload); // resize
    await fs.unlink(tempUpload);

//   await fs.rename(tempUpload, avatarName);
  const avatarURL = path.join("avatars", avatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });
//   const optimizeAvatar = await Jimp.read(resultUpload);

//   await optimizeAvatar.resize(256, 256).write(resultUpload); // resize

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  changeSubscription: ctrlWrapper(changeSubscription),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerificationEmail: ctrlWrapper(resendVerificationEmail),
};
