const { Router } = require("express");

const courseRouter = Router();

courseRouter.post("/purchase" , function(req,res){

});

courseRouter.get("/preview" , function(req,res){
 res.json({
  message:"course preview endpoint"
 })
});

module.exports = {
  courseRouter:courseRouter
}