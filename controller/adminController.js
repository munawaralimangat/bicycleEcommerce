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
const flash = require('connect-flash')

dotenv.config({path:'config.env'})




//view admin
const loginView = async (req, res, next) => {
  let additionalErrors =  req.flash('error');
  res.render('login', { errors:additionalErrors });
};

// login admin
const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.method);
  const additionalErrors = [];

  if (!email || !password) {
    additionalErrors.push("Please fill in all fields");
  }

  if (additionalErrors.length > 0) {
    return res.render("login", {
      email,
      password,
      errors: additionalErrors
    });
  }

  // Use passport.authenticate as middleware
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res);
};



//dashboaed view
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

