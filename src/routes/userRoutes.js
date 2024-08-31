const express=require('express');
const router=express.Router();
const  userController=require('../controllers/userController');
const authMiddleware=require('../middlewares/authMiddleware');

router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/logout',authMiddleware.authenticateUser,userController.logout)
router.get('/profile',authMiddleware.authenticateUser,userController.getUserProfile);
router.get('/:id',authMiddleware.authenticateUser,userController.getUserDetails);

module.exports=router;