const express = require('express');
const router = express.Router();
const multer = require('multer');
const {requireAuth,checkAdmin} = require('../middleware/adminAuth');
const passport = require('passport');
const {validateLogin} = require('../services/validation');
const multerConfig = require('../multer/config.multer');
const upload = multer(multerConfig)

const {loginView,loginAdmin,dashboardView,logOut} = require('../controller/adminloginController');
const adminUserController = require('../controller/adminUserController');
const adminProductController = require('../controller/adminProductController');
const adminCategoryController = require('../controller/adminCategoryController');
const adminOffersController = require('../controller/adminOffersController');
const adminOrdersController = require('../controller/adminOrdersController')
const { route } = require('./userroutes');
// const {loginCheck} = require('../auth/jwt')



router.get('*',checkAdmin);

//view
router.get('/login',loginView);
router.get('/dashboard',requireAuth, dashboardView);


//register and login
router.post('/login',loginAdmin);

//logout
router.get('/logout',logOut);


//users routes
router.get('/users',requireAuth,adminUserController.usersView);
router.post('/users/block/:Id',adminUserController.userBlock);

//category routes
router.get('/category',requireAuth,adminCategoryController.categoriesView);
router.get('/category/:categoryId',adminCategoryController.getCategories);
router.post('/category/addcategory',adminCategoryController.createCategories);
router.put('/category/:categoryId',adminCategoryController.editCategory);
router.delete('/category/:categoryId',adminCategoryController.deleteCategory);


//product routes
router.get('/products',requireAuth,adminProductController.productsView);
router.get('/product/:productId',adminProductController.getProduct);
//router.post('/product/addproduct',upload.single('frontImage'),upload.array('productImages', 4),adminProductController.createProduct);
router.post('/product/addproduct',upload.fields([ 
    { name: "frontImage", maxCount: 1 },
    { name: "productImages", maxCount: 3 },
  ]),adminProductController.createProduct);

router.put('/product/:productId',
upload.fields([ 
  { name: "frontImage", maxCount: 1 },
  { name: "additionalImages", maxCount: 3 },
]),
adminProductController.updateProduct);
router.delete('/product/:productId',adminProductController.deleteProduct);

// router.get("/adminReg",loginController.reg)

//offers route
router.get('/offers',adminOffersController.viewOffers);

  //add coupen
router.post('/addcoupen',adminOffersController.addCoupen);
router.delete('/coupon/:id',adminOffersController.deleteCoupon);

//orders route
router.get('/orders',adminOrdersController.viewOrders)



module.exports = router;
