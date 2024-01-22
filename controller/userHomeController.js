const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')
const Size = require('../model/schema/sizeSchema')

// module.exports.landingView = async (req,res)=>{
//     try{
//         const products = await Product.find().populate('category_name')
//         res.render('user/userHome',{
//             regLog: "Log In",
//             formurl: "login",
//             products:products
//         })
//     }catch(error){
//         console.error('Error fetching products:', error);
//         res.status(500).send('Internal Server Error');
//     }
    
// }

module.exports.userHomeView = async (req,res)=>{
    try{
        const products = await Product.find().populate('category_name')
        res.render('user/userHome',{products:products})
    }catch(error){
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports.homeAllProducts = async (req, res) => {
    console.log(req.query.sort)
    try {
        let products;
        const sortOptions = req.query.sort;

        if (sortOptions === "HighToLow") {
            products = await Product.find().sort({ product_price: -1 }).populate('category_name');
        } else {
            products = await Product.find().sort({ product_price: 1 }).populate('category_name');
        // } else {
        //     products = await Product.find().populate('category_name');
        }
        const sizes = await Size.find({ size_name: { $in: ["Small", "Medium", "Large"] } });
        const sizeIdMap = {};
        sizes.forEach(size => {
          sizeIdMap[size.size_name.toLowerCase()] = size._id;
        });
        res.render('user/allproducts', { products: products ,sizes:sizeIdMap});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.viewProfile = async (req,res)=>{
    console.log("this works")
    res.send("user profile")
}

module.exports.logout = async (req,res)=>{
    console.log("logout")
    res.cookie('jwtus', '',{maxAge:1})
    res.redirect('/brepublic/landing/login')
}