const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('../middleware/jwt')
const validations = require('../middleware/validations')
const fileUpload = require('../middleware/fileUpload')
const createError = require('http-errors')
require("dotenv").config();


//USER REGISTER
router.post("/register", fileUpload.single("file"), validations.validateUser, async (req, res) => {
  console.log("Register User API called")
  try {
    if (req.file === undefined) return res.status(403).json({ message: "Please select a file" });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      imageId: req.file.location
    });

    const user = await newUser.save();
    const accessToken = await jwt.signAccessToken(user.id)
    let response = {
      result: "success",
      email: user.email,
      pic: req.file.location,
      accessToken
    }

    return res.status(200).send(response)

  } catch (err) {
    if (err.code == 11000) {
      return res.status(409).send({ error: "Conflict" })
    } else {
      return res.status(500).send({ error: "Internal Server Error" })
    }
  }
});


//USER LOGIN
router.post("/login", async (req, res) => {
  console.log("Login User API called")
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw createError.NotFound('User not registered')

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) throw createError.Unauthorized()

    const accessToken = await jwt.signAccessToken(user.id)

    res.status(200).send({ result: "success", accessToken })
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
