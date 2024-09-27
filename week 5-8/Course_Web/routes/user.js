const { Router } = require("express");
const userRouter = Router();
const {z} = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {userModel}=require("../db");
const {auth} = require("../auth");
userRouter.post("/signup" ,async function(req,res){
const requiredBody = z.object({
  email:z.string().min(3).max(100).email(),
  password:z.string().min(5).max(30).regex(/[A-Z]/).regex(/[a-z]/).regex(/[/\d]/),
  first_name:z.string().min(2).max(100),
  last_name:z.string().min(2).max(100)
})

const data = requiredBody.safeParse(req.body);

if(!data.success){
res.json({
  message:"Incorrect format",
  error:data.error
})
return
}

const email = req.body.email;
const password = req.body.password;
const first_name = req.body.first_name;
const last_name = req.body.last_name;

let errorThrown = false;

try {
  const hash = await bcrypt.hash(password,5);

  await userModel.create({
    email:email,
    password:hash,
    first_name:first_name,
    last_name:last_name
  });
} catch (error) {
  console.log("error while putting in db");
  res.json({
    message:"User exists already"
  });
  errorThrown=true;
}
if(!errorThrown){
  res.json({
    message:"You are Signed Up",
    user:data
  })
}
});

userRouter.post("/signin" ,async function(req,res){
  const requiredBody = z.object({
    email:z.string().min(3).max(100).email(),
    password:z.string().min(5).max(30).regex(/[A-Z]/).regex(/[a-z]/).regex(/[/\d]/)
  })
  
  const data = requiredBody.safeParse(req.body);
  
  if(!data.success){
  res.json({
    message:"Incorrect format",
    error:data.error
  })
  return
  }
  
  const email = req.body.email;
  const password = req.body.password;
  
  const response = await userModel.findOne({
    email:email
  })
  if(!response){
    res.status(403).json({
      message:"User Data not found"
    })
    return
  }

  const passwordMatch = await bcrypt.compare(password,response.password);

  if(passwordMatch){
    const token = jwt.sign({
      id:response._id.toString()
},process.env.JWT_SECRET);
res.json({
  token
})
  }else{
    res.status(403).json({
      message:"Incorrect Credentials"
    })
  }
  
});

userRouter.get("/purchases" ,auth, function(req,res){
res.json({
  message:"user purchases"
})
});

module.exports={
  userRouter:userRouter
}