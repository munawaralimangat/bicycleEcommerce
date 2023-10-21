const express = require('express');
const router = express.Router();
const jwt=require('../auth/jwt')
const {validateLogin} = require('../auth/validation')
const {
    loginView,
    loginAdmin
} = require('../controller/adminController')

//const {loginCheck} = require('../auth/jwt')


//view
router.get('/admin/login',loginView)


//register and login
router.post('/admin/dashboard',validateLogin,loginAdmin)
// router.get("/adminReg",loginController.reg)


/* GET users listing. */









module.exports = router;
