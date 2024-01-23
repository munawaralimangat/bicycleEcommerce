const express = require('express')
const userLoginController = require('../controller/userLoginController')
const userHomeController = require('../controller/userHomeController')
const userProfileController = require('../controller/userProfileController')
const userProductController = require('../controller/userProductController')
const userCategoryController = require('../controller/userCategoryController')
const userCartController = require('../controller/cartController')
const userWishlistController = require('../controller/wishlistController')
const checkoutController = require('../controller/checkoutController')

const {requireAuth,checkUser} = require('../middleware/authMiddleware')
const router = express.Router()


router.use('*',checkUser)

//user landing controller
router.get('/landing',userHomeController.userHomeView)

//user login and signup controller
router.get('/landing/register',userLoginController.userRegView)//signup get
router.post('/landing/register',userLoginController.userRegPost)//signup post
router.get('/landing/login',userLoginController.userLoginView)//login get
router.post('/landing/login',userLoginController.userLoginPost)//login post

//user profile
router.get('/profile',userProfileController.viewProfile)
router.get('/users/:userId',userProfileController.getUserData)
router.put('/update-user/:userId',userProfileController.updateUser)
    //edit and delete address
        router.put('/edit-address/:addressId',userProfileController.editAddress)
        router.delete('/delete-address/:addressId',userProfileController.deleteAdrress)
    //orders status
    router.put('/cancel-order/:orderId',userProfileController.cancellOrder)

    //user home controller
        router.get('/landing/userhome',requireAuth,userHomeController.userHomeView)
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
router.get('/cart',userCartController.viewCart);
router.post('/addtocart',userCartController.addToCart);
router.get('/cartItem',userCartController.getCart)
router.put('/increment/:itemId',userCartController.incrementQuantity);
router.put('/decrement/:itemId',userCartController.decrementQuantity);
router.delete('/removefromcart',userCartController.removeFromCart);

// cart-coupon
router.get('/getcoupon',userCartController.getCoupon)
router.post('/savecoupon',userCartController.saveCouponToCart)
router.delete('/removecoupon',userCartController.removeCouponFromCart)

//wishlist route
router.get('/wishlist',userWishlistController.viewWishlist);
router.post('/addtowishlist',userWishlistController.addToWishlist);
router.delete('/removefromwishlist',userWishlistController.removeFromWishlist);

//checkout routes
router.get('/checkout',checkoutController.viewCheckout);
router.post('/placeorder',checkoutController.placeOrder);

//address routes
router.get('/get-address/:addressId',userProfileController.getOneAddress);
router.post('/addAddress',checkoutController.postAddress);


















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