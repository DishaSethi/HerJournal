const Blog=require('../models/blog');

const checkBlogExists=async(req,res,next)=>{

    try{
        const blog=await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({
    message:'Blog not found'
}) ;     }
req.blog=blog;
next();
    } catch(error){
        console.log(error);
        res.status(500).json({
            
            message:error.message
        });
    }
};

module.exports={
    checkBlogExists,
};