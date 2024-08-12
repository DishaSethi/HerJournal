const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const {BlogTagsEnum}=require('../utils/common/enums');
const BlogSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
  author:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  tags:{
    type:[String],
    enum:Object.values(BlogTagsEnum),
    // required:false,
    default:[],
    validate:[tagLimit,'Exceeds the limit of 5 tags.'],
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});


function tagLimit(val){
  return val.length<=5;
}

module.exports=mongoose.model('Blog',BlogSchema);