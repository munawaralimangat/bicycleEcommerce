const express = require('express');
const router = express.Router();
const {requireAuth,checkAdmin} = require('../middleware/adminAuth')
const passport = require('passport')
const {validateLogin} = require('../services/validation')


const {loginView,loginAdmin,dashboardView,logOut} = require('../controller/adminloginController')
//const {loginCheck} = require('../auth/jwt')

// const {protectRoute} = require('../auth/protect')
// const {loginCheck} = require('../auth/passport')

router.get('*',checkAdmin)

//view
router.get('/login',loginView)
router.get('/dashboard',requireAuth, dashboardView);


//register and login
router.post('/login',loginAdmin)

//logout
router.get('/logout',logOut)



// router.get("/adminReg",loginController.reg)

/* GET users listing. */

module.exports = router;
