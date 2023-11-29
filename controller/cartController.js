const Cart = require('../model/schema/cartSchema')
const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')

module.exports.viewCart = async (req,res)=>{
    try{
        const {userId} = req.query;
        const cart = await Cart.findOne({user:userId}).populate({
            path:'items.product',
            populate:{
                path:'category_name',
                model:'Category',
            }
        })
        console.log("hell",cart)
        res.render('user/cart',{cart})    
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }

}

module.exports.addToCart = async (req,res)=>{
    try {
        const {userId,productId,quantity}=req.body
        console.log(req.body)
        //check if the product exists
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({error:"product not found"})
        }
        let cart = await Cart.findOne({user:userId})

        if(!cart){
            cart = new Cart({user:userId})
        }
        const existingCartItem = cart.items.find(item => item.product.equals(productId));
        if(existingCartItem){
            existingCartItem.quantity += quantity || 1;
        }else{
            cart.items.push({product:productId,quantity:quantity || 1})
        }
        cart.totalPrice += product.product_price * (quantity || 1)
        await cart.save();
        res.json({message:"product added to cart"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
}