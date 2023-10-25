const express = require('express')
const router = express.Router()

const {userLandingView,userLoginView,userLoginPost,userRegView} = require('../controller/userLoginController')

//landing page
router.get('/landing',userLandingView)

//user login view
router.get('/landing/login',userLoginView)
//user registration view
router.get('/landing/register',userRegView)

//user login
router.post('/landing/login',userLoginPost)

module.exports = router