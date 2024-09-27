const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/courses");
const { adminRouter } = require("./routes/admin");
const app = express();
app.use(express.json());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);


async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongodb connected");
    app.listen(3000,()=>{
      console.log("port running on 3000");
    });
  } catch (error) {
    console.log(error);
  }
}

main();