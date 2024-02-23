const axios = require('axios')
const dotenv = require('dotenv')
const {check,validationResult} = require('express-validator')
const mongoose = require('mongoose')
const Admin = require('../model/schema/adminSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validateLogin = require('../services/validation')
const flash = require('connect-flash')
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
  const jwtCookie = req.cookies.jwtad;

  if (!jwtCookie) {
    let additionalErrors = req.flash('error');
    return res.render('admin/login', { errors: additionalErrors });
  }

  try {
    const decodedToken = jwt.verify(jwtCookie, 'mwrmwr');
    res.redirect('/admin/dashboard');
  } catch (error) {
    let additionalErrors = req.flash('error');
    res.render('admin/login', { errors: additionalErrors });
  }
};

// login admin
const loginAdmin = async (req, res, next) => {
  const {email,password} = req.body
  console.log(req.body)

  try {
    const admin = await Admin.login(email,password)
    const token = createToken(admin._id)
    res.cookie('jwtad',token,{httpOnly:true,maxAge:maxAge * 1000})
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
  console.log("logout")
    res.cookie('jwtad', '',{maxAge:1})
    res.redirect('/admin')
}


module.exports = {
    loginView,
    loginAdmin,
    dashboardView,
    logOut,
    // reg
};