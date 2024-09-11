const express=require('express');
const router=express.Router();
const axios=require('axios');
const Blog=require('../models/blog');
const Comment=require('../models/comment');
router.get('/',async (req,res)=>{
   try{
   const response=await axios.get('http://localhost:5000/api/blogs',{
    params:req.query
   });
   const blogs=response.data;
   const isAuthenticated=req.cookies.token ? true: false;
   res.render('home',{blogs,isAuthenticated});
   } catch (error){
    console.log(error);
    res.status(500).json({
        message:error.message
    });
   }
});

router.get('/blogs/:id', async(req,res)=>{
    try{
        const token=req.cookies.token;
        // console.log('token :',token);
        const response=await axios.get(`http://localhost:5000/api/blogs/${req.params.id}`,{withCredentials:true,  headers:{
            Authorization:`Bearer ${token}`
        }});
        const {blog,user}=response.data;
        const isAuthenticated=req.cookies.token ? true: false;

        const comments=await Comment.find({blog:req.params.id}).populate('user');

        console.log('Blog data:',blog);
        console.log('Comments:',comments);
        res.render('blog',{blog,user,comments,isAuthenticated});
    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message});
    }
});


router.post('/delete/:id',async(req,res)=>{
  try{
        const blogId=req.params.id;
        const token=req.cookies.token;
    // console.log(token);
        const response=await axios.delete(`http://localhost:5000/api/blogs/${blogId}`,{
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        if(response.data.message === 'Blog deleted'){
            console.log(response.data.message);
            res.redirect('/profile');
        }else{
            console.log('Delete failed:',response.data.message);
            const isAuthenticated=req.cookies.token ? true: false;
            res.render('blog',{error:'Failed to delete blog',blog:response.data.blog,isAuthenticated});
        }
    } catch (error){
      console.log('Error deleting blog:',error);
      res.status(500).json({
        message:'Error deleting blog'
      });
    }
});

router.get('/update/:id',async(req,res)=>{
    const blogId=req.params.id;
    const token=req.cookies.token;
    if(!token){
        res.render('login');
    }
    try{
        const response=await axios.get(`http://localhost:5000/api/blogs/${blogId}`,{
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${token}`
            }
    });

    res.render('update',{blog:response.data});
    }catch(error){
        console.log('Error fetching blog data',error);
        const isAuthenticated=req.cookies.token ? true: false;
        res.render('blog',{error:'Failed to load blog for editing',isAuthenticated});
    }
});


router.post('/update/:id',async(req,res)=>{
try{
    const blogId=req.params.id;
    const token=req.cookies.token;

    const response=await axios.put(`http://localhost:5000/api/blogs/${blogId}`,{
        title:req.body.title,
        content:req.body.content,
    
    },{
        withCredentials:true,
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    const isAuthenticated=req.cookies.token ? true: false;
    if(response.data.message=='Blog updated successfully'){
        console.log(response.data.message);

        res.redirect(`/blogs/${blogId}`);
    }else{
        console.log('Updates failed:',response.data.message);
        res.render('blog',{error:'Failed to update blog',blog:response.data.blog,isAuthenticated});
    }
} catch(error){
    console.log('Error updating blog:',error);
    res.status(500).json({
      message:'Error updating blog'
    });   
}
});
module.exports=router;
