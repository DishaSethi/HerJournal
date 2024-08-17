const express=require('express');
const router=express.Router();
const commentController=require('../controllers/commentController');
const authMiddleware=require('../middlewares/authMiddleware');
const blogMiddleware=require('../middlewares/blogMiddleware');

router.post('/:id',blogMiddleware.checkBlogExists,authMiddleware.authenticateUser,commentController.addComment);
router.get('/:id',commentController.getCommentsByBlog);
router.delete('/:commentId',authMiddleware.authenticateUser,commentController.deleteComment);
// please look into router.delete once more needs modifications
module.exports=router;
