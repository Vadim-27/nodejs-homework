const { User } = require('../models/user');
const bcrypt = require("bcrypt");
const { ctrlWrapper } = require('../utils');
const { HttpError } = require('../helpers')
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require("jimp");



const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, '..', 'public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use");
        
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL =  gravatar.url(email)
    console.log(avatarURL, "url avatar");
    const result = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });
    
    res.status(201).json({
        name: result.name,
        email: result.email,
    });
}

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
    
   
  await fs.rename(tempUpload, avatarName);
  const avatarURL = path.join("avatars", avatarName);
    await User.findByIdAndUpdate(_id, { avatarURL });
     const optimizeAvatar = await Jimp.read(resultUpload);
     
       await optimizeAvatar.resize(256, 256).write(resultUpload); // resize
           
     
  res.json({ avatarURL });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    changeSubscription: ctrlWrapper(changeSubscription),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
};
