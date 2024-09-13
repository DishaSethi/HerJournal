const express=require('express');
const app=express();
const path=require('path');
const session = require('express-session');
const cookieParser=require('cookie-parser');
const MongoStore = require('connect-mongo');
const cors = require('cors');

app.use(express.static(path.join(__dirname,'../public')));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


const loginRoutes=require('./src/frontendRoutes/loginRoutes');
const homeRoutes=require('./src/frontendRoutes/homeRoutes');
const profileRoutes=require('./src/frontendRoutes/profileRoutes');

app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
    // allowedHeaders: ['Content-Type', 'Authorization']
}));




app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/blog-platform' }),
    cookie: { secure: false,httpOnly:true,sameSite:'lax' } // Set to true in production
}));

app.use(express.urlencoded({extended:true}));

app.use('/',homeRoutes);
app.use('/',loginRoutes);
app.use('/',profileRoutes);


const PORT=process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});