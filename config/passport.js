const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Load user Model 
const User = require('../models/user');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({
            usernameField:'email'
        }, (email,password,done) => {
            console.log('user here - '+done);

            // Match User
            User.findOne({'email':email})
            .then((user)=>{
                console.log('user here - ');
                console.log(user);
                if(!user){
                    return done(null,false,{message:'This email is not registered.'});
                }

                // Match Passwords
                if(bcrypt.compareSync(password, user.password)){
                    return done(null,user);
                }
                else {
                    return done(null,false,{message:'Incorrect password.'});
                }

            })
            .catch((err)=>console.log(err));
        })
    );

    // Serialize user
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    // Deserialize user
    passport.deserializeUser((id, done) => {
        User.findById(id,(err,user)=>{
            done(err,user);
        });
    });
}
