const bcrypt = require("bcrypt");
const {z} = require("zod");
const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const {UserModel , TodoModel } = require("./db");
const mongoose= require("mongoose");
mongoose.connect("mongodb+srv://kamalapuramnithin:Nithin%402004mongodb@cluster0.3zihz.mongodb.net/todo-app");

app.post("/signup" , async function(req,res){
  
 const requiredBody = z.object({
  email:z.string().min(3).max(100).email(),
  name:z.string().min(3).max(100),
  password:z.string().min(3).max(30).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/)
 })

 const parsedDataWithSuccess = requiredBody.safeParse(req.body);

 if(!parsedDataWithSuccess.success){
  res.json({
    message:"Incorrect format",
    error:parsedDataWithSuccess.error
  })
  return
 }

 const email = req.body.email;
 const password = req.body.password;
 const name = req.body.name;
 let errorThrown = false;
 try {
  const hashedPassword = await bcrypt.hash(password,5);
  console.log(hashedPassword);
 
  await UserModel.create({
   email:email,
   password:hashedPassword,
   name:name
  });
 
 } catch (error) {
  console.log("Error while putting in DB");
  res.json({
    message:"user exists already"
  });
  errorThrown=true;
 }
 if(!errorThrown){
  res.json({
    message:"You are signed up"
   })
 }

});

app.post("/signin" , async function(req,res){
  const email = req.body.email;
  const password = req.body.password;

  const response = await UserModel.findOne({
    email:email
  })
  if(!response){
    res.status(403).json({
      message:"User Data does not exist"
    })
    return
  }

  const passwordMatch = await bcrypt.compare(password,response.password);

  if(passwordMatch){
    const token=jwt.sign({
      id: response._id.toString()
    },JWT_SECRET);
    res.json({
      token
    })
  }else{
    res.status(403).json({
      message:"Incorrect Credentials"
    })
 }
});

app.post("/todo" ,auth, async function(req,res){
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;
  

  await TodoModel.create({
    title:title,
    done:done,
    userId:userId
  })

  res.json({
    message:"Todo created"
   })
});

app.get("/todos" , auth ,async function(req,res){
  const userId = req.userId;

  const todos = await TodoModel.find({
      userId
  });

  res.json({
      todos
  })
});

app.listen(3000);