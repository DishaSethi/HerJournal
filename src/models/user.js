const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true},
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio: { 
        type: String, 
        default: "" 
    },
    profilePicture: {
         type: String,
          default: "public/imgs/avatars/avatar1.png"
         }
});

module.exports=mongoose.model('User',UserSchema);