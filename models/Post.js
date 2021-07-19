const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    photo: {
      type: String
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
