const express=require('express');
const app=express();
const path=require('path');
const session = require('express-session');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


const loginRoutes=require('./routes/loginRoutes');
const homeRoutes=require('./routes/homeRoutes');
const profileRoutes=require('./routes/profileRoutes');

app.use(session({
    secret:'your_secret_key',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}));

app.use(express.urlencoded({extended:true}));

app.use('/',homeRoutes);
app.use('/',loginRoutes);
app.use('/',profileRoutes);

const PORT=process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});