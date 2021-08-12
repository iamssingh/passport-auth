const express=require('express');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db=require('./config/keys').MongoUri;

// Connect to MongoDB
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    console.log("MongoDB connected.");
})
.catch((err)=>{
    console.log("Error connecting database.")
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser
app.use(express.urlencoded({ extended: false }));

// Session
app.use(session({
    secret: 'keyboard cat',
    resave:true,
    saveUninitialized:true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('success_msg');
    res.locals.error=req.flash('error');
    next();
})

// Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
  
const PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
    console.log('Server listening at port '+PORT);
});