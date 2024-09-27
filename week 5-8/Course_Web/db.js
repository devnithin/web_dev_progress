const {mongoose} = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema =new Schema({
  email:{type:String , unique:true } ,
  password:String,
  first_name:String,
  last_name:String
});

const adminSchema =new Schema({
  email:String ,
  password:String,
  first_name:String,
  last_name:String
});

const courseSchema = new Schema({
  title:String,
  description:String,
  price:Number,
  imageUrl : String,
  creatorId:ObjectId
});

const purchaseSchema = new Schema({
  courseId:ObjectId,
  userId:ObjectId
})

const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports={
  userModel,
  adminModel,
  courseModel,
  purchaseModel
}