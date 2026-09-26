import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true,minlength:2,maxlength:80},email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true},password:{type:String,required:true,select:false},createdAt:{type:Date,default:Date.now}},{timestamps:true});
export default mongoose.model('User',schema);
