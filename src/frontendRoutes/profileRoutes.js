const express=require('express');
const router=express.Router();
const axios=require('axios');
const authMiddleware=require('../middlewares/authMiddleware');
const apiUrl = process.env.API_URL || 'http://localhost:5000/api';


router.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/login');

        const response = await axios.get(`${apiUrl}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        });
 

        const { username, email, blogs = [], user = {} } = response.data;

        res.render('profile', { 
            username, 
            email, 
            bio: user.bio || "", 
            profilePicture: user.profilePicture || "/default-avatar.png", 
            blogs,
           
            user, 
            isSelf: true 
        });
    } catch (error) {
        console.error('Error loading profile:', error);
        res.status(500).json({ message: 'Error loading profile' });
    }
});


router.post('/profile/update',async(req,res)=>{
    try{
        const token=req.cookies.token;

        if(!token){
            return res.redirect('/login');
        }

        const {email,bio,profilePicture}=req.body;

        await axios.put(`${apiUrl}/users/profile`,
            {email,bio,profilePicture},
            {headers:{Authorization: `Bearer ${token}`},withCredentials:true}
        );
        res.redirect('/profile');
    }catch(error){
        console.error('Error updating profile:',error);
        res.status(500).json({message:'Error updating profile'});
    }
});

router.get(`/profile/view/:id`,async(req,res)=>{
    try{
        const userId=req.params.id;
        const token=req.cookies.token;

        if(!token){
            return res.redirect('/login');
        }

        const response=await axios.get(`${apiUrl}/users/profile/${userId}`,{
            headers:{Authorization:`Bearer ${token}`},
            withCredentials:true,
        });

        const {user,username, email,bio, profilePicture, blogs}=response.data;

        const currentUserResponse = await axios.get(`${apiUrl}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        });
        const currentUser = currentUserResponse.data.user;
        const isFollowing = currentUser.following.includes(userId);


        res.render('profile',{user, username, email, bio, profilePicture: `${process.env.API_URL || 'http://localhost:5000'}${user.profilePicture}`,
             blogs ,isSelf: false,isFollowing });
    }catch(error){
        console.error('Error viewing profile:',error);
        res.status(500).json({message:'Error viewing profile'});
    }
});

router.post('/profile/follow/:userId',async(req,res)=>{
    const userId=req.params.userId;
    console.log("User ID:", userId); // This will help verify the value


    try{

        const token=req.cookies.token;

        if(!token){
            return res.redirect('/login');
        }
        const response= await axios.post(`${apiUrl}/users/profile/follow/${userId}`,{},{
            headers:{Authorization:`Bearer ${token}`},
            withCredentials:true,
            },

            );
            // console.log(response);

            res.status(200).json({ success: true, message: "Followed successfully" });
        }catch(error){
            console.log(error);
            res.status(error.response?.status || 500).json({
                error: error.response?.data || 'Something went wrong',
            });
        }

    });

    router.post('/profile/unfollow/:userId', async (req, res) => {
        const  userId  = req.params.userId;
    
        try {
            const token=req.cookies.token;

        if(!token){
            return res.redirect('/login');
        }
            // Forward the request to the backend API
            const response = await axios.post(`${apiUrl}/users/profile/unfollow/${userId}`, {}, {
                headers:{Authorization:`Bearer ${token}`},
            withCredentials:true,
            });
    
            // Send the backend response back to the client
            res.status(200).json({ success: true, message: "Unfollowed successfully" });
        } catch (error) {
            console.log(error);
            res.status(error.response?.status || 500).json({
                error: error.response?.data || 'Something went wrong',
            });
        }
    });

router.get(`/profile/:userId/followers`, async(req,res)=>{
    const { userId } = req.params;
    
   try{
    const token=req.cookies.token;
    if(!token){
        return res.redirect('/login');
    }

       const followersResponse = await axios.get(`${apiUrl}/users/profile/${userId}/followers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(followersResponse.data);
          const followers = followersResponse.data.followers.map(follower => follower.username);
          const followings = followersResponse.data.followings.map(following => following.username);
         
          console.log(`followers:`,followers, `followings:`,followings); 
          res.json({ followers,followings });

   }catch(error){
    console.log(error);
    res.status(error.response?.status || 500).json({
        error: error.response?.data || 'Something went wrong',
    });


   }
})
  
    


module.exports=router;