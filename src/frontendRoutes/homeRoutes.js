const express=require('express');
const router=express.Router();
const axios=require('axios');
const Blog=require('../models/blog');
router.get('/',async (req,res)=>{
   try{
   const response=await axios.get('http://localhost:5000/api/blogs',{
    params:req.query
   });
   const blogs=response.data;
//    const isAuthenticated=req.cookies.token ? true: false;
   res.render('home',{blogs});
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
        const blog=response.data;
        console.log('Blog data:',blog);
        res.render('blog',{blog});
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
            res.render('blog',{error:'Failed to delete blog',blog:response.data.blog});
        }
    } catch (error){
      console.log('Error deleting blog:',error);
      res.status(500).json({
        message:'Error deleting blog'
      });
    }
});
module.exports=router;
