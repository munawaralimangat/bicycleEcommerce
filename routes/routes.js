const express = require('express');
const router = express.Router();
const jwt=require('../auth/jwt')
const passport = require('passport')
const {validateLogin} = require('../auth/validation')

const {loginView,loginAdmin,dashboardView} = require('../controller/adminController')
//const {loginCheck} = require('../auth/jwt')

const {protectRoute} = require('../auth/protect')
const {loginCheck} = require('../auth/passport')

//view
router.get('/login',validateLogin,loginView)
router.get('/dashboard', protectRoute, dashboardView);


//register and login
router.post('/login',loginAdmin)





// router.get("/adminReg",loginController.reg)

/* GET users listing. */









module.exports = router;
