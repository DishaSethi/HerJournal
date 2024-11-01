const express=require('express');
const router=express.Router();
const axios=require('axios');
const Blog=require('../models/blog');
const Comment=require('../models/comment');
const apiUrl = process.env.API_URL || 'http://localhost:5000/api';

router.get('/',async (req,res)=>{
   try{
   const response=await axios.get(`${apiUrl}/blogs`,{
    params:{page:parseInt(req.query.page)||1,limit:5,
        keyword:req.query.keyword||''
    }
   });

   const {blogs,totalBlogs,currentPage,totalPages}=response.data;

   
   const isAuthenticated=req.cookies.token ? true: false;
   res.render('home',{blogs,totalBlogs,isAuthenticated,currentPage,totalPages, keyword: req.query.keyword || ''});
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
        const response=await axios.get(`${apiUrl}/blogs/${req.params.id}`,{withCredentials:true,  headers:{
            Authorization:`Bearer ${token}`
        }});
        const {blog,comments,user}=response.data;
        const isAuthenticated=req.cookies.token ? true: false;

        // const comments=await Comment.find({blog:req.params.id}).populate('user');

        console.log('Blog data:',blog);
        console.log('Comments:',comments);


        // console.log("user id:",user);
        console.log("author id:",blog.author._id);
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
        const response=await axios.delete(`${apiUrl}/blogs/${blogId}`,{
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
      console.error('Error deleting blog:',error);
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
        const response=await axios.get(`${apiUrl}/blogs/${blogId}`,{
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${token}`
            }
    });
    const tagResponse=await axios.get(`${apiUrl}/blogs/tags`,{
        headers:{Authorization:`Bearer ${token}`},
        withCredentials:true,
    })
    console.log("tagsResponse:",tagResponse.data);
    const allowedTags=tagResponse.data;
    // res.render('update',{allowedTags});

    console.log("response is:",response.data);

    res.render('update',{blog:response.data,allowedTags});
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

    const response=await axios.put(`${apiUrl}/blogs/${blogId}`,{
        title:req.body.title,
        content:req.body.content,
        tags:req.body.tags
    
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
