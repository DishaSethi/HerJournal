const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const blog = require('../models/blog');


// const JWT_SECRET='your_jwt_secret_key';

const register=async(req,res)=>{
    const {username,email,password}=req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }
    try{
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                msg:'User already exists'
            });
        }
        const salt=await bcrypt.genSalt(10);
        console.log('Password:',password);
        console.log('Salt:',salt);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            
            username,
            email,
            password:hashedPassword,
             bio:'',
              profilePicture:'/public/imgs/avatars/avatar1.png'});
        await newUser.save();
        res.status(201).json({
            message:'User registered successfully'
        });
    }catch(error){
        console.log(error);
        res.status(500).json({

            message:error.message
            
        });
    }
};

const login=async(req,res)=>{
    const {email,password}=req.body;
    // password=req.body.password;

    try{
        const user=await User.findOne({email});
        if(!user){
        return res.status(400).json({
            message:'Invalid credentials'
        });
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) {
            return res.status(400).json({
                message:'Invalid credentials'
            });
        }
        // const payload={user:user.id}

        const token=jwt.sign({ user:user.id},'your_jwt_secret',{expiresIn:'1d'});
        
       return res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
          .status(200)
          .json({
            message:'Logged in successfully',
            token:token
        });


    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

const getUserDetails=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({
                message:'User not found'
            });

        }

        res.json(user);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};


const getUserProfile=async(req,res)=>{
    try{
        const userId=req.user;
        console.log("User id:", userId);
        const user = await User.findById(req.user);

        if(!user){
            return res.status(404).json({
                message:'User not found'
            })
        }

        const blogs = await blog.find({ author: userId }).sort({ createdAt: -1 });


        res.json({
            email:user.email,
            username:user.username,
            blogs,
            user,
            
        });
    }catch (error){
        console.log(error);
        res.status(500).json({
            message:error.message
        });
    }
}

const logout=async(req,res)=>{

    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production'
        });
        res.status(200).json({
            message: 'Logged out successfully'
        });
        
    }catch(error){
        // console.log('Logout Error:',error);
        res.status(500).json({
            message:'Logout failed'
        });

    }
};


const updateUserProfile=async(req,res)=>{
    try{
        const userId=req.user;
        const {email,bio,profilePicture}=req.body;

        const updatedUser=await User.findByIdAndUpdate(
            userId,
            {
                email:email,
                bio:bio,
                profilePicture:profilePicture
            },
            {new:true}
        );

        if(!updatedUser){
            return res.status(404).json({message:'User not found'});
        }
        return res.status(200).json({message:'Profile updated successfully', user:updatedUser});
     } catch(error){
            console.error('Error updating user profile:',error)
            res.status(500).json({message:'Server error'});
        }


        
    }


    const followUser = async (req, res) => {
        try {
            const userIdToFollow = req.params.userId; // Ensure this is defined
            console.log('User ID to follow:', userIdToFollow);
    
            const userToFollow = await User.findById(userIdToFollow);
            if (!userToFollow) {
                return res.status(404).json({ message: 'User to follow not found' });
            }
    
            const currentUser = await User.findById(req.user);
            console.log(`currentUser ${currentUser}`); // Assuming req.user is set by middleware
            if (!currentUser) {
                return res.status(404).json({ message: 'Current user not found' });
            }
    
            // Add follow logic here
            if (!currentUser.following.includes(userIdToFollow)) {
                currentUser.following.push(userIdToFollow);
                userToFollow.followers.push(req.user);
    
                await currentUser.save();
                await userToFollow.save();
            }
    
            res.status(200).json({ message: 'User followed successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    

    const unfollowUser = async (req, res) => {
        try {
            const userIdToUnfollow = req.params.userId; // User to unfollow
            console.log('User ID to unfollow:', userIdToUnfollow);
    
            const userToUnfollow = await User.findById(userIdToUnfollow);
            if (!userToUnfollow) {
                return res.status(404).json({ message: 'User to unfollow not found' });
            }
    
            const currentUser = await User.findById(req.user); // Assuming `req.user` is set by middleware
            if (!currentUser) {
                return res.status(404).json({ message: 'Current user not found' });
            }
    
            // Check if the current user is actually following the user to unfollow
            if (!currentUser.following.includes(userIdToUnfollow)) {
                return res.status(400).json({ message: 'You are not following this user' });
            }
    
            // Remove the user from the following list of the current user
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== userToUnfollow._id.toString()
            );
    
            // Remove the current user from the followers list of the user to unfollow
            userToUnfollow.followers = userToUnfollow.followers.filter(
                (id) => id.toString() !== currentUser._id.toString()
            );
    
            // Save the changes to both users
            await currentUser.save();
            await userToUnfollow.save();
    
            return res.status(200).json({ success: true, message: 'User unfollowed successfully' });
        } catch (error) {
            console.error('Error during unfollow:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    };
    
      

   
const getProfileById=async(req,res)=>{
    try{
        const userId=req.params.id;

        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const blogs=await blog.find({author:userId}).sort({createdAt:-1});

        res.status(200).json({
            user,
            username:user.username,
            email:user.email,
            bio:user.bio,
            profilePicture:user.profilePicture,
            blogs,

        });
    }catch(error){
        console.error('Error fetching user profile:',error);
        res.status(500).json({message:'Server error'});
    }
}


const getfollowers=async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
                    .populate('followers', 'username')
                    .populate('following','username');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ followers: user.followers, followings:user.following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports={
    register,
    login,
    getUserDetails,
    getUserProfile,
    logout,
    updateUserProfile,
    followUser,
    unfollowUser,
    getProfileById,
    getfollowers
    // getBlogsByUser
};