const express = require('express')
const router = express.Router()

const {userLoginView,userLoginPost} = require('../controller/userLoginController')

//landing page
router.get('/landing',userLoginView)

//user login view
router.get('/landing/login',userLoginPost)

module.exports = router