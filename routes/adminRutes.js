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
const { route } = require('./userroutes');
//const {loginCheck} = require('../auth/jwt')



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
router.post('/product/addproduct',upload.single('productImage'),adminProductController.createProduct);
router.put('/product/:productId',upload.single('productImage'),adminProductController.updateProduct);
router.delete('/product/:productId',adminProductController.deleteProduct);

// router.get("/adminReg",loginController.reg)





module.exports = router;
