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

        const categories = await Category.find({category_name:{$in:["Mountain Bikes","Road Bikes"]}})
        const catMap = {};
        categories.forEach(cat => {
            
            catMap[cat.category_name.toLowerCase().replace(/\s/g, '')] = cat._id;
        });

        
        const sizes = await Size.find({ size_name: { $in: ["Small", "Medium", "Large"] } });
        const sizeIdMap = {};
        sizes.forEach(size => {
          sizeIdMap[size.size_name.toLowerCase()] = size._id;
        });
        res.render('user/allProducts', { products: products ,sizes:sizeIdMap,categories:catMap });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.logout = async (req,res)=>{
    res.cookie('jwtus', '',{maxAge:1})
    res.redirect('/login')
}