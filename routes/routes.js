const express = require('express');
const router = express.Router();
const jwt=require('../auth/jwt')
const passport = require('passport')
const {validateLogin} = require('../auth/validation')


const {loginView,loginAdmin,dashboardView,logOut} = require('../controller/adminloginController')
//const {loginCheck} = require('../auth/jwt')

const {protectRoute} = require('../auth/protect')
const {loginCheck} = require('../auth/passport')

//view
router.get('/login',loginView)
router.get('/dashboard', protectRoute, dashboardView);


//register and login
router.post('/login',loginAdmin)

//logout
router.get('/logout',logOut)



// router.get("/adminReg",loginController.reg)

/* GET users listing. */









module.exports = router;
