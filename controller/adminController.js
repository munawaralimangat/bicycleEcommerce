const axios = require('axios')
const dotenv = require('dotenv')
const {check,validationResult} = require('express-validator')
const passport = require('passport')
const mongoose = require('mongoose')
const Admin = require('../model/schema/adminSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {authenticate} = require('../auth/jwt')
const validateLogin = require('../auth/validation')
const secretKey = "helllo"

dotenv.config({path:'config.env'})

//view admin
const loginView = async (req, res, next) =>{
    res.render('login', { errors: false});
};


//login admin
const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.method)
  
  const errors = validationResult(req);
  console.log(errors.array()); // Debugging

  if (!email || !password) {
    const message = "Please fill in all fields";
    return res.render("login", {
        email,
        password,
        errors
    });
}

// Use passport.authenticate as middleware
passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
})(req, res);

};

const dashboardView = (req,res)=>{
  res.render('dashboard')
  console.log(req.method)
}


module.exports = {
    loginView,
    loginAdmin,
    dashboardView
    // reg
};

// const reg = async (req,res,next) =>{
//     const admin = process.env.ADMIN_USERNAME
//     const password = process.env.ADMIN_PASSWORD
//     const hashPass = await bcrypt.hash(password,10)
//     const user = new schema({
//         email:admin,
//         password:hashPass
//     })
//     const saved = await user.save()
//     console.log(saved)
// }

///////////////////////////////////////////////////////////////////////////////////////////////////

