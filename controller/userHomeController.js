const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')

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

module.exports.logout = async (req,res)=>{
    console.log("logout")
    res.cookie('jwtus', '',{maxAge:1})
    res.redirect('/brepublic/landing/login')
}

module.exports.homeAllProducts = async (req, res) => {
    try {
        let products;
        const sortOptions = req.query.sort;

        if (sortOptions === "lowToHigh") {
            products = await Product.find().sort({ product_price: 1 }).populate('category_name');
        } else if (sortOptions === "highToLow") {
            products = await Product.find().sort({ product_price: -1 }).populate('category_name');
        } else {
            products = await Product.find().populate('category_name');
        }

        console.log("hello")
        res.render('user/allproducts', { products: products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};