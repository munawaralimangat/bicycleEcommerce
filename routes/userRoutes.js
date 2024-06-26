const express = require('express')
const otpController = require('../controller/otpController')
const userLoginController = require('../controller/userLoginController')
const userHomeController = require('../controller/userHomeController')
const userProfileController = require('../controller/userProfileController')
const userProductController = require('../controller/userProductController')
const userCategoryController = require('../controller/userCategoryController')
const userCartController = require('../controller/cartController')
const userWishlistController = require('../controller/wishlistController')
const checkoutController = require('../controller/checkoutController')

const {requireAuth,checkUser} = require('../middleware/authMiddleware')
const router = express.Router();


router.use('*',checkUser)

//user landing controller
router.get('/',userHomeController.userHomeView) 

//user login and signup controller
router.get('/register',userLoginController.userRegView)//signup get
router.post('/register',userLoginController.userRegPost)//signup post
router.get('/login',userLoginController.userLoginView)//login get
router.post('/login',userLoginController.userLoginPost)//login post

//forgot password controller
router.get('/forgot-password',userLoginController.forgotPasswordView)
router.get('/change-password',userLoginController.changePasswordView)
router.post('/update-password',userLoginController.updatePassword)

//otp routes
router.post('/send-otp',otpController.sendOTP)
router.post('/verify-otp',otpController.verifyOtp)

//user profile
router.get('/profile',userProfileController.viewProfile)
router.get('/users/:userId',userProfileController.getUserData)
router.put('/update-user/:userId',userProfileController.updateUser)
    //edit and delete address
        router.put('/edit-address/:addressId',userProfileController.editAddress)
        router.delete('/delete-address/:addressId',userProfileController.deleteAdrress)
        
    //orders status
    router.put('/cancel-request/:orderId',userProfileController.cancelRequest)
    // router.put('/cancel-order/:orderId',userProfileController.cancellOrder)

    //user home controller
        router.get('/userhome',requireAuth,userHomeController.userHomeView)
        router.get('/viewall',userHomeController.homeAllProducts)
        router.get('/logout',requireAuth,userHomeController.logout)

    //product controller
        router.get('/products',userProductController.getAllProducts)
        router.get('/product/:productId',userProductController.viewProduct)

    //search product
        router.get('/search',userProductController.searchProduct)
        router.get('/search-with-sort',userProductController.searchWithSort)


//category routes
router.get('/mountainbikes',userCategoryController.viewMountain)
router.get('/roadbikes',userCategoryController.viewRoadBikes)

//cart routes
router.get('/cart',requireAuth,userCartController.viewCart);
router.post('/addtocart',requireAuth,userCartController.addToCart);
router.get('/cartItem',userCartController.getCart)
router.put('/increment/:itemId',userCartController.incrementQuantity);
router.put('/decrement/:itemId',userCartController.decrementQuantity);
router.delete('/removefromcart',userCartController.removeFromCart);

// cart-coupon
router.get('/getcoupon',userCartController.getCoupon)
router.post('/savecoupon',userCartController.saveCouponToCart)
router.delete('/removecoupon',userCartController.removeCouponFromCart)

//wishlist route
router.get('/wishlist',requireAuth,userWishlistController.viewWishlist);
router.post('/addtowishlist',requireAuth,userWishlistController.addToWishlist);
router.delete('/removefromwishlist',userWishlistController.removeFromWishlist);

//checkout routes
router.get('/checkout',requireAuth,checkoutController.viewCheckout);
router.post('/placeorder',requireAuth,checkoutController.placeOrder);
router.get('/success',requireAuth,checkoutController.successPayment)

//address routes
router.get('/get-address/:addressId',userProfileController.getOneAddress);
router.post('/addAddress',checkoutController.postAddress);

//invoice
router.get('/generate-invoice/:orderId',checkoutController.invoiceGenerate)


















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