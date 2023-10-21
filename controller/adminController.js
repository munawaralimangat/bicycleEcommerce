const axios = require('axios')
const dotenv = require('dotenv')
const {check,validationResult} = require('express-validator')
const mongoose = require('mongoose')
const Admin = require('../model/schema/adminSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {authenticate} = require('../auth/jwt')
// const validateLogin = require('../auth/validation')
const secretKey = "helllo"

dotenv.config({path:'config.env'})

//view admin
const loginView = async (req, res, next) =>{
    res.render('login', { errors: false});
};


//login admin
const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  const validationChecks = [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
  ];
  
  const errors = validationResult(req);
  console.log(errors)

  if(!errors.isEmpty()){
    let message = "error val"
    res.status(400).render('login', {errors:message });
    return;
  }

  const authResult = await authenticate(email, password);

  if (authResult.success) {
    res.render('dashboard');
  } else {
    res.status(401).render('login',{errors:"",message: authResult.message });
  }
};




module.exports = {
    loginView,
    loginAdmin,
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

// const { email, password } = req.body;

// try {
//   // Use Promises with .exec() to handle the query
//   const admin = await Admin.findOne({ email }).exec();

//   if (!admin) {
//     return res.status(401).json({ message: 'Authentication failed. Invalid username or password' });
//   }

//   const isPasswordValid = await admin.comparePassword(password);

//   if (!isPasswordValid) {
//     return res.status(401).json({ message: 'Authentication failed. Invalid username or password' });
//   }

//   const token = jwt.sign({ adminId: admin._id }, secretKey, { expiresIn: '1h' });
//   res.render('dashboard')
//   res.json({ token });
// } catch (error) {
//   console.error(error);
//   res.status(500).json({ message: 'Internal Server Error' });
// }