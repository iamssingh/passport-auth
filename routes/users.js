const express = require('express');
const router=express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

// User Model
const User = require('../models/user');

// Login Page
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login');
});

// Register Page
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render('register');
});

// Login Handler
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        failureRedirect: '/users/login',
        successRedirect: '/dashboard',
        failureFlash: true
    })(req,res,next);
});

// Register Handler
router.post('/register',[],(req,res)=>{
    let {name, email, password, password2} = req.body;
    let errors=[]; 
    if(!name || !email || !password || !password2){
        errors.push({msg:'All fields are required'});
        res.render('register',{errors:errors});
    }
    else {
        User.findOne({email:email})
        .then((user)=>{
            if(user){
                errors.push({msg:'Email already exists'});
                res.render('register',
                    {
                        errors:errors, 
                        name:name, 
                        email:email,
                        password:password,
                        password2:password2
                    }
                );
            } else {
                password = bcrypt.hashSync(password,bcrypt.genSaltSync(10));
                const newUser = new User({name:name,email:email,password:password});
                newUser.save()
                .then(()=>{
                    req.flash('success_msg','Registration successful');
                    res.redirect('/users/login');
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
        })
    }
});

// Login Page
router.get('/logout',[],(req,res)=>{
    req.logout();
    req.flash('success_msg','Logout successful');
    res.redirect('/users/login');
});

module.exports=router;
