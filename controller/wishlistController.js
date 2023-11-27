const Wishlist = require('../model/schema/wishlistSchema');
const Product = require('../model/schema/productSchema');

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