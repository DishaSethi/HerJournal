const express=require('express');
const router=express.Router();
const axios=require('axios');


router.get('/profile',async (req,res)=>{
 try{
    const token=req.session.token;
    if(!token){
        return res.redirect('/login');
    }

    const response=await axios.get('http://localhost:5000/api/users/profile',{
        headers:{authorization: ` ${token}`}
    });

    const {username,email,blogs}=response.data;

    res.render('profile',{username, email,blogs});
 }catch(error){
    console.log(error);
    res.status(500).json({message: 'Error loading profile'});
 }
});


module.exports=router;