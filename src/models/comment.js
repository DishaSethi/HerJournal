const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const commentSchema=new Schema({
    blog:{
        type:Schema.Types.ObjectId,
        ref:'Blog',
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Comment',commentSchema);
