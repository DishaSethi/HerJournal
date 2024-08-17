const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors=require('cors');
const connectDB=require('./config/db');
const blogsRouter=require('./routes/blogRoutes');
const userRouter=require('./routes/userRoutes');
const app=express();
const commentsRouter=require('./routes/commentRoutes');
//Connect to Database
connectDB();

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Routes
app.use('/api/blogs',blogsRouter);
app.use('/api/users',userRouter);
app.use('/api/comments',commentsRouter);

const PORT=process.env.PORT||5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT} `));
