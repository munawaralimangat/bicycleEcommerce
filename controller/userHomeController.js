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

module.exports.logout =(req,res)=>{
    console.log("logout")
    res.cookie('jwtus', '',{maxAge:1})
    res.redirect('/brepublic/landing/login')
}