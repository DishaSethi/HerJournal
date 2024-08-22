const express=require('express');
const router=express.Router();
const axios=require('axios');

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',async(req,res)=>{
    try{
        const{email, password}=req.body;

        const response=await axios.post('http://localhost:5000/api/users/login',{
            email,
            password
        });

    
    const {token, user}=response.data;

    req.session.token=token;

    res.redirect('/profile');
    } catch(error){
        console.log(error);
        res.render('login',{
            error:'Invalid email or password'
        });
    }
});

module.exports=router;