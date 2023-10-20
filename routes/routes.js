const express = require('express');
const router = express.Router();
const jwt=require('../auth/jwt')
const {validateLogin} = require('../auth/validation')
const {
    loginView,
    loginAdmin
} = require('../controller/loginController')

//const {loginCheck} = require('../auth/jwt')


//view
router.get('/admin/login',validateLogin,loginView)


//register and login
router.post('/admin/dashboard',loginAdmin)
// router.get("/adminReg",loginController.reg)


/* GET users listing. */









module.exports = router;
