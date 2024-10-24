const express=require('express');
const router=express.Router();
const {checkBlogExists}=require('../middlewares/blogMiddleware');
const blogController=require('../controllers/blogController');
const authMiddleware=require('../middlewares/authMiddleware');
const filterMiddleware=require('../middlewares/filterMiddleware');
const BlogTagsEnum=require('../utils/common/enums');
// console.log('BlogTagsEnum:', BlogTagsEnum);
// const BlogTagsEnum = Object.freeze({
//     TECHNICAL: 'Technical',
//     COOKING: 'Cooking',
//     FASHION: 'Fashion',
//     TRAVEL: 'Travel',
//     LIFESTYLE: 'Lifestyle',
//     HEALTH: 'Health',
// });
router.post('/create',authMiddleware.authenticateUser,blogController.createBlog);
router.get('/tags',(req,res)=>{
    try {
        const tags = Object.values(BlogTagsEnum);
        // console.log(tags);
        res.status(200).json(tags );
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})
router.get('/',filterMiddleware.applyFilters,blogController.getAllBlogs);

router.get('/:id',authMiddleware.authenticateUser,blogController.getBlogById);
router.delete('/:id',authMiddleware.authenticateUser,checkBlogExists,blogController.deleteBlog);
router.put('/:id',authMiddleware.authenticateUser,blogController.updateBlog);

// router.get('/user/:id',authMiddleware.authenticateUser,blogController.getBlogsByUser);
// router.get('/tag/:tag',filterMiddleware.applyFilters,blogController.getBlogsByTag);

module.exports=router;