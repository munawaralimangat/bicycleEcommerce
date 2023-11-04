const axios = require('axios')
const dotenv = require('dotenv')
const {check,validationResult} = require('express-validator')
const passport = require('passport')
const mongoose = require('mongoose')
const Admin = require('../model/schema/adminSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {authenticate} = require('../auth/jwt')
const validateLogin = require('../services/validation')
const flash = require('connect-flash')
const User = require('../model/schema/userSchema')
const cookieParser = require('cookie-parser')

dotenv.config({path:'config.env'})

const handleErrors = (err)=>{
  console.log(err.message,err.code)
  let errors = {email:"",password:""}
  console.log(errors)
  //incorrect email
  if(err.message === 'Incorrect email'){
    errors.email = 'Email is not registered'
  }
  if(err.message === 'Incorrect password'){
    errors.password = 'Incorrect password'
  }

  //duplicate errors
  if(err.code === 11000){
    errors.email = 'Email is already registered';
    return errors;
  }

  if(err.message.includes('User validation failed')){
    Object.values(err.errors).forEach(({properties}) =>{
        errors[properties.path] = properties.message
    })
  }
  return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id)=>{
    return jwt.sign({id},'mwrmwr',{
        expiresIn:maxAge
    })
}



//view admin
const loginView = async (req, res, next) => {
  let additionalErrors =  req.flash('error');
  res.render('admin/login', { errors:additionalErrors });
};

// login admin
const loginAdmin = async (req, res, next) => {
  const {email,password} = req.body
  console.log(req.body)

  try {
    const admin = await Admin.login(email,password)
    const token = createToken(admin._id)
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000})
    res.status(200).json({admin:admin._id})
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
};




//dashboaed view
const dashboardView = async (req,res)=>{
  res.render('admin/dashboard')
  console.log(req.method)
}

const logOut = async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Error destroying session:', sessionErr);
      }
      res.header('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.header('Expires', '0');
      res.header('Pragma', 'no-cache');
      res.redirect('/admin/login'); // Redirect the user to the login page
    });
  });
}

// const logOut = (req, res, next) => {
// 	res.clearCookie('connect.sid');  // clear the cookie
// 	req.logout(function(err) {
// 		console.log(err)
// 		res.redirect('/admin/login'); // send to the client
// 	})
// }

module.exports = {
    loginView,
    loginAdmin,
    dashboardView,
    logOut,
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

// // login admin passport
// const loginAdmin = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     console.log(req.method);
//     const additionalErrors = [];

//     if (!email || !password) {
//       additionalErrors.push("Please fill in all fields");
//     } else if (email.length <= 8) {
//       additionalErrors.push("Email must have at least eight characters"); // Change express validator later
//     }else if(password.length <=5){
//       additionalErrors.push("password must have at least five characters"); // Change express validator later
//     }

//     if (additionalErrors.length > 0) {
//       return res.render("admin/login", {
//         email,
//         password,
//         errors: additionalErrors
//       });
//     }

//     // Use passport.authenticate as middleware
//     passport.authenticate('local', {
//       successRedirect: '/admin/dashboard',
//       failureRedirect: '/admin/login',
//       failureFlash: true
//     })(req, res);
//   } catch (error) {
//     // Handle any errors that occur during the execution of this function
//     next(error); // Pass the error to the next middleware
//   }
// };
