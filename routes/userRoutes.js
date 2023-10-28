const express = require('express')
const router = express.Router()

const {userLandingView,userLoginView,userLoginPost,userRegView, userRegPost} = require('../controller/userLoginController')

//landing page
router.get('/landing',userLandingView)

//user login view
router.get('/landing/login',userLoginView)

//user registration
router.get('/landing/register',userRegView)
router.post('/landing/register',userRegPost)

//user login
router.post('/landing/login',userLoginPost)



module.exports = router