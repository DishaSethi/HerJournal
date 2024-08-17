const Comment=require('../models/comment');
const Blog=require('../models/blog');


const addComment=async (req,res)=>{
    const {id:blogId}=req.params;
    const {content}=req.body;
if(!content){
    return res.status(400).json({message:'Comment content is required'});
}
    try{
        const blog=await Blog.findById(blogId);
       
        const comment=new Comment({
            blog:blogId,
            user:req.user,
            content,
        });

        const savedComment=await comment.save();
        res.status(201).json(savedComment);
        }
        catch(error){
            res.status(500).json({message: error.message});
        }
    };


    const getCommentsByBlog=async(req,res)=>{
        const {id:blogId}=req.params;

        try{
            const comments=await Comment.find({blog:blogId}).populate('user');
            res.status(200).json(comments);
        } catch(erro){
            res.status(500).json({
                message:error.message
            });
        }
    };

    const deleteComment=async (req,res)=>{
        const {commentId}=req.params;

        try{
            const comment=await Comment.findById(commentId);
            if(!comment){
                return res.status(404).json({
                    message:'Comment not found'
                });

                
            }

            if(comment.user.toString()!=req.user.toString()){
                return res.status(403).json({
                    message:'Not authorized to delete this'
                })
            }

            await Comment.deleteOne({_id:commentId});
            res.json({
                message:'Comment deleted successfully'
            });
        } catch(error){
            res.status(500).json({
                message:error.message
            });
        }
    };


    module.exports={
        addComment,
        getCommentsByBlog,
        deleteComment,
    };