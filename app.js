const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoute = require("./routes/user.rest");
const postRoute = require("./routes/posts.rest");

dotenv.config();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then(() => {
    console.log("Connected to MongoDB")
    let port = process.env.PORT ? process.env.PORT : 3000;
    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((err) => console.log(err));


app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);



