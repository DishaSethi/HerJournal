const express=require('express');
const router=express.Router();
const axios=require('axios');
const session = require('express-session');
const MongoStore = require('connect-mongo');

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




router.get('/create',async (req,res)=>{
    res.render('create');
})

module.exports=router;