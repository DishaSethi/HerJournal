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
        const user=await User.findById(userId).select('-password');

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
            user
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
        console.log('Logout Error:',error);
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


module.exports={
    register,
    login,
    getUserDetails,
    getUserProfile,
    logout,
    updateUserProfile
    // getBlogsByUser
};