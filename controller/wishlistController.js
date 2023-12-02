const Wishlist = require('../model/schema/wishlistSchema');
const Product = require('../model/schema/productSchema');

module.exports.viewWishlist = async (req,res)=>{
    try {
        const {userId} = req.query;
        const wishlist = await Wishlist.findOne({user:userId}).populate({
            path:'items.product',
            populate:{
                path:'category_name',
                model:'Category',
            }
        })
        console.log("hello",wishlist)
        res.render('user/wishlist',{wishlist})
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports.addToWishlist = async (req,res)=>{
    try {
        const {userId,productId} = req.body;
        console.log(req.body)
        const product = Product.findById(productId)
        if(!product){
            return res.status(404).json({error:"product not found"})
        }

        let wishlist = await Wishlist.findOne({user:userId})

        if(!wishlist){
            wishlist = new Wishlist({user:userId})
        }

        const isProductInWishlist = wishlist.items.some(item => item.product.equals(productId))
        
        if(!isProductInWishlist){
            wishlist.items.push({product:productId})
        }
        await wishlist.save();
        res.json({message:"product added to wishlist"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.removeFromWishlist = async (req,res)=>{
    try{
        const {productId,userId} = req.query
        console.log(req.query)
       let wishlist = await Wishlist.findOne({user:userId})

       if(!wishlist){
        return res.status(404).json({error:'cart not found'})
       }
       wishlist.items = wishlist.items.filter(item => !item.product.equals(productId))

       await wishlist.save()
       res.json({message:"product removed from wishlist"})
    }catch(error){
        console.error(error)
        res.status(500).json({error:"internal server error"})
    }
    
}