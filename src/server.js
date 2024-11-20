
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config({path:path.resolve(__dirname,'../.env')});
const http=require('http');
const socketIo=require('socket.io');
// const Blog=require('./models/blog');

const blogsRouter = require('./routes/blogRoutes');
const userRouter = require('./routes/userRoutes');
const commentsRouter = require('./routes/commentRoutes');
const loginRoutes = require('./frontendRoutes/loginRoutes');
const homeRoutes = require('./frontendRoutes/homeRoutes');
const profileRoutes = require('./frontendRoutes/profileRoutes');
//Connect to Database

const connectDB = require('./config/db');
connectDB();

const app = express();
const server=http.createServer(app);
const io=  socketIo(server);

app.set('io',io);
//Middleware

app.use(cookieParser());
app.use((req, res, next) => {
    console.log('Cookies:', req.cookies); // Log all cookies to verify
    next();
});

app.use(cors({
    origin:'http://localhost:5000',
    credentials:true,
    // allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    secret:'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl:  process.env.MONGODB_URI }),
    cookie: { secure:process.env.NODE_ENV==='production',httpOnly:true,sameSite:'lax' } // Set to true in production
}));

// app.get('/test-cookie', (req, res) => {
//     res.cookie('test', 'cookie_value', { path: '/', httpOnly: true });
//     res.json({ message: 'Cookie set' });
// });

// app.get('/check-cookie', (req, res) => {
//     res.json({ cookies: req.cookies });
// });
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, '..', 'public')));

//Routes
app.use('/api/blogs',blogsRouter);
app.use('/api/users',userRouter);
app.use('/api/comments',commentsRouter);

//Frontend Routes
app.use('/',homeRoutes);
app.use('/',loginRoutes);
app.use('/',profileRoutes);

app.use((req,res,next)=>{
    const err=new Error('Page Not Found');
    err.status=404;
    next(err);
})


app.use((err,req,res,next)=>{
    res.status(err.status|| 500);
    res.render('error',{error:err});
})
//Socket.io connection
io.on('connection',(socket)=>{
    console.log('a user connected');


// handle new comment
// socket.on('newComment',(comment)=>{
//     io.emit('updateComments',comment);
// });

socket.on('disconnect',()=>{
    console.log('user disconnected');
});
});
// socket.emit('testEvent',{message:'Hello from server!'});
    // handle disconnection
 
 console.log(process.env.MONGODB_URI);
const PORT=process.env.PORT||5000;
server.listen(PORT,()=> console.log(`Server running on port ${PORT} `));
