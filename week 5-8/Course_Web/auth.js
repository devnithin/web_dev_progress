require("dotenv").config();
const jwt = require("jsonwebtoken");
function auth(req,res,next){
  const token = req.headers.token;

  const response = jwt.verify(token,process.env.JWT_SECRET);

  if(response){
    req.userId=token.userId;
    next();
  }else{
    res.status(403).json({
      message:"Incorrect Credentials"
    })
  }
}

module.exports={
  auth
}
