const express=require('express');
const router=express.Router();
const axios=require('axios');
const authMiddleware=require('../middlewares/authMiddleware');
const apiUrl = process.env.API_URL || 'http://localhost:5000/api';


router.get('/profile',async (req,res)=>{
 try{
    const token = req.cookies.token;
    console.log("cookies",token);

    if (!token) {
        return res.redirect('/login');
    }

    const response=await axios.get(`${apiUrl}/users/profile`,{
        headers:{Authorization: `Bearer ${token}`},withCredentials:true}
    );

    const {username,email,blogs,user}=response.data;
// const user=req.user;
console.log("user",user);
    res.render('profile',{username, email,blogs,user});
 }catch(error){
    console.log(error);
    res.status(500).json({message: 'Error loading profile'});
 }
});


router.post('/profile/update',async(req,res)=>{
    try{
        const token=req.cookies.token;

        if(!token){
            return res.redirect('/login');
        }

        const {email,bio,profilePicture}=req.body;

        const response=await axios.put(`${apiUrl}/users/profile`,
            {email,bio,profilePicture},
            {headers:{Authorization: `Bearer ${token}`},withCredentials:true}
        );
        res.redirect('/profile');
    }catch(error){
        console.error('Error updating profile:',error);
        res.status(500).json({message:'Error updating profile'});
    }
});



module.exports=router;