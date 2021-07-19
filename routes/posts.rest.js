const router = require("express").Router();
const Post = require("../models/Post");
const jwt = require('../middleware/jwt')
const validations = require('../middleware/validations')
const _ = require('lodash')
const fileUpload = require('../middleware/fileUpload')
var mongoose = require('mongoose');


//CREATE POST
router.post("/", jwt.verifyAccessToken, fileUpload.single("file"), async (req, res) => {
  console.log("Create Post API called")
  try {
  if (req.file === undefined) return res.status(403).json({ message: "Please select a file" });

  let newPostObject = {
    title: req.body.title,
    description: req.body.description,
    createdBy: req.payload.aud,
    photo: req.file.location
  }

  const newPost = new Post(newPostObject);

  
    const savedPost = await newPost.save();
    let response = { result: 'success' }
    response = _.omit(savedPost._doc, ['__v', 'photo', 'createdAt', 'updatedAt'])

    res.status(200).json(response)
  } catch (err) {
    if (err.code == 11000) {
      return res.status(409).send({ error: "Conflict" })
    } else {
      return res.status(500).json(err);
    }
  }
});


//UPDATE POST
router.put("/:id", jwt.verifyAccessToken, fileUpload.single("file"), validations.validatePost, async (req, res) => {
  try {
    console.log("Update Post API called")

    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));
    if (!post) return res.status(404).json({ message: "Not Found" })

    let newBody = req.body
    if (req.file) {
      newBody.photo = req.file.location
    }

    if (post.createdBy === req.payload.aud) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          mongoose.Types.ObjectId(req.params.id),
          {
            $set: newBody,
          },
          { new: true }
        );

        let response = { result: 'success' }
        response = _.omit(updatedPost._doc, ['__v', 'createdBy', 'createdAt', 'updatedAt'])
        res.status(200).json(response);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json({ message: "Not authorised" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



//DELETE POST
router.delete("/:id", jwt.verifyAccessToken, async (req, res) => {
  try {
    console.log("Delete Post API called")
    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));
    if (!post) return res.status(404).json({ message: "Not Found" })
    if (post.createdBy === req.payload.aud) {
      try {
        await post.delete();
        return res.status(200).json({ message: "Post has been deleted" });
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(401).json({ message: "Not authorized" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});


//GET POST BY ID
router.get("/:id", jwt.verifyAccessToken, async (req, res) => {
  try {
    console.log("Get Post By ID API called")

    const post = await Post.findById(mongoose.Types.ObjectId(req.params.id));
    if (!post) return res.status(404).json({ message: 'Not Found' });

    if (post.createdBy != req.payload.aud) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let response = { result: 'success' }
    response = _.omit(post._doc, ['__v', 'createdBy', 'createdAt', 'updatedAt'])

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
});



//GET ALL POSTS FOR THE USER
router.get("/", jwt.verifyAccessToken, async (req, res) => {
  console.log("Get All Post API called")

  const userId = req.payload.aud;
  try {
    let posts;
    if (userId) {
      posts = await Post.find({ createdBy: userId });
    }
    if (posts) {
      1
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "Not Found" })
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
