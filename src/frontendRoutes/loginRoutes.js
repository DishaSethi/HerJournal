const express=require('express');
const router=express.Router();
const axios=require('axios');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const { BlogTagsEnum } = require('../utils/common/enums');

router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/blog-platform' }),
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true in production
}));

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login',async(req,res)=>{
    try{
        const{email, password}=req.body;

        const response=await axios.post('http://localhost:5000/api/users/login',{
           email,
            password},
            {withCredentials:true}
        );

        console.log('Response:', response.data);
      const token=response.data.token;
console.log('token:',token);

   
if (token) {

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    console.log("cookie",token);
    res.redirect('/profile');
    res.end();
    //  console.log('Session after login:', req.session);
        // alert(response.data.message);
    
//     const token=response.data.token;
// localStorage.setItem('token',token);
    // req.session.token=token;


    }} catch(error){
        console.log(error);
        res.render('login',{
            error:'Invalid email or password'
        });
    }
});


router.post('/logout',async(req,res)=>{
try{
    const token=req.cookies.token;
    const response=await axios.post('http://localhost:5000/api/users/logout',{},{
        withCredentials:true,
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    res.clearCookie('token', { path: '/' });
    console.log('Logout response:',response.data);

    res.status(200).json({
        message: 'Logged out successfully'
    });
}catch(error){
    console.log('Logout Error:',error);
    res.status(500).json({
        message:'Logout failed'
    });
}
});



router.get('/create', async (req, res) => {
    const token = req.cookies.token;
    console.log('Token received on server:', token); // Debugging log
// if(!token){
//     res.redirect('/login');
// }else
   {
        // You might want to verify the token here
        try {
            // Verify the token
            const decoded = jwt.verify(token, 'your_jwt_secret');
            // Proceed to render the create page if token is valid
            const tagResponse=await axios.get('http://localhost:5000/api/blogs/tags',{
                headers:{Authorization:`Bearer ${token}`},
                withCredentials:true,
            })
            console.log("tagsResponse:",tagResponse.data);
            const allowedTags=tagResponse.data;
            res.render('create',{allowedTags});
        } catch (err) {
            console.error('Token verification failed:', err);
            res.redirect('/login'); // Redirect to login if token verification fails
        }
    }
});

router.post('/create',async(req,res)=>{
    const { title, content,tags } = req.body;
    // const token = req.cookies.token;
    const token=req.cookies.token;
    if(!token){
        res.redirect('/login');
    }
    // let parsedTags=[];
    // try{
    //     parsedTags=JSON.parse(tags);

    // }catch(error){
    //     return res.status(400).send('Invalid tags format');

    // }

    // if(!Array.isArray(parsedTags) || parsedTags.length>5){
    //     return res.status(400).send('You can only select up to 5 tags');
    // }
        try{
            const response=await axios.post(`http://localhost:5000/api/blogs/create`,{
                title,
                content,
                tags
            },{
                headers:{Authorization: `Bearer ${token}`},
                withCredentials:true
            });
            console.log("response is",response);
            if(response.status===201){
                res.redirect(`/blogs/${response.data._id}`);
            }else{
                res.status(400).send('Failed to create blog');
            }
        }catch(error){
            console.log(error);
            res.status(500).send('Internal Server error');
        }

    

});


router.get('/register',(req,res)=>{
    res.render('register');
});


router.post('/register',async(req,res)=>{
    const {username,email,password}=req.body;

    try{
        const response=await axios.post('http://localhost:5000/api/users/register',{
            username,
            email,
            password
        },{withCredentials:true});

        if(response.status==201){
            console.log('User registered successfully:',response.data);

            res.redirect('/login');
        }else{
            res.render('register',{error:'Registration failed. Try again.'});
        }
    } catch(error){
        console.log('Error registering :',error);

        res.render('register',{error:'An error occurred during registration'});
    }
});

module.exports=router;