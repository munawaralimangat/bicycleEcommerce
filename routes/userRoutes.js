const express = require('express')
const userController = require('../controller/userLoginController')
const router = express.Router()



router.get('/landing',userController.landingView)


router.get('/landing/register',userController.userRegView)//signup get
router.post('/landing/register',userController.userRegPost)//signup post
router.get('/landing/login',userController.userLoginView)//login get
router.post('/landing/login',userController.userLoginPost)//login post


router.get('/landing/userHome',userController.userHomeView)















// const {userLandingView,userLoginView,userLoginPost,userRegView,userRegPost,userHomeView} = require('../controller/userLoginController')

// //landing page
// router.get('/landing',userLandingView)

// //user login view
// router.get('/landing/login',userLoginView)

// //user registration
// router.get('/landing/register',userRegView)
// router.post('/landing/register',userRegPost)

// //user login
// router.post('/landing/login',userLoginPost)

// //user landing View
// router.get('/landing/userLanding',userHomeView)



module.exports = router