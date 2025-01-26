const express=require('express');
const router=express.Router();
const  userController=require('../controllers/userController');
const authMiddleware=require('../middlewares/authMiddleware');

router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/logout',authMiddleware.authenticateUser,userController.logout);
router.post('/profile/follow/:userId',authMiddleware.authenticateUser,userController.followUser);
router.post('/profile/unfollow/:userId',authMiddleware.authenticateUser,userController.unfollowUser);
router.get('/profile/:id/followers',authMiddleware.authenticateUser,userController.getfollowers);

router.get('/profile',authMiddleware.authenticateUser,userController.getUserProfile);
router.put('/profile',authMiddleware.authenticateUser,userController.updateUserProfile);
router.get('/profile/:id', authMiddleware.authenticateUser, userController.getProfileById);

router.get('/:id',authMiddleware.authenticateUser,userController.getUserDetails);

module.exports=router;