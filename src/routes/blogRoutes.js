const express=require('express');
const router=express.Router();
const {checkBlogExists}=require('../middlewares/blogMiddleware');
const blogController=require('../controllers/blogController');
const authMiddleware=require('../middlewares/authMiddleware');
const filterMiddleware=require('../middlewares/filterMiddleware');

router.post('/create',authMiddleware.authenticateUser,blogController.createBlog);
router.get('/',filterMiddleware.applyFilters,blogController.getAllBlogs);
router.get('/:id',blogController.getBlogById);
router.delete('/:id',authMiddleware.authenticateUser,checkBlogExists,blogController.deleteBlog);
router.put('/:id',authMiddleware.authenticateUser,blogController.updateBlog);
// router.get('/user/:id',authMiddleware.authenticateUser,blogController.getBlogsByUser);
// router.get('/tag/:tag',filterMiddleware.applyFilters,blogController.getBlogsByTag);

module.exports=router;