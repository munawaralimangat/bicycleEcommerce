const express = require('express')
const userLoginController = require('../controller/userLoginController')
const userProductController = require('../controller/userProductController')
const userCartController = require('../controller/cartController')
const userWishlistController = require('../controller/wishlistController')

const {requireAuth,checkUser} = require('../middleware/authMiddleware')
const router = express.Router()


router.use('*',checkUser)

//user landing controller
router.get('/landing',userLoginController.landingView)

//user login and signup controller
router.get('/landing/register',userLoginController.userRegView)//signup get
router.post('/landing/register',userLoginController.userRegPost)//signup post
router.get('/landing/login',userLoginController.userLoginView)//login get
router.post('/landing/login',userLoginController.userLoginPost)//login post

//user home controller
router.get('/landing/userhome',requireAuth,userLoginController.userHomeView)
router.get('/logout',requireAuth,userLoginController.logout)

//category routes
router.get('/mountainbikes',userProductController.viewMountain)
router.get('/roadbikes',userProductController.viewRoadBikes)

//cart routes
router.post('/addtocart',userCartController.addToCart)

//wishlist route
router.post('/addtowishlist',userWishlistController.addToWishlist)














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