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
            },
            populate:{
                path:'variations.size',
                model:'Size'
            }
        })

       

        console.log("cart",cart)
        if(cart){
        res.render('user/cart',{cart})
        }else{
            res.render('user/emptyCart')
        }    
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

module.exports.removeFromCart = async (req, res) => {
    const { productId, userId } = req.query;
    console.log(req.query);
    try {   
        let cart = await Cart.findOne({ user: userId }).populate({
            path:'items.product',
            populate:{
                path:'category_name',
                model:'Category',
            }
        })

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const existingCartItemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (existingCartItemIndex !== -1) {
            const item = cart.items[existingCartItemIndex];
            const itemTotalPrice = item.product.product_price * item.quantity;

            if (!isNaN(cart.totalPrice) && !isNaN(itemTotalPrice)) {
                cart.totalPrice -= itemTotalPrice;
            } else {
                cart.totalPrice = 0;
            }
            
            cart.items.splice(existingCartItemIndex, 1);

            await cart.save();
            res.json({ message: "Product removed from cart" });
        } else {
            res.status(404).json({ error: "Product not found in the cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.incrementQuantity = async (req,res)=>{
    const productId = req.params.itemId;
    console.log("product id:",productId)
    try {
        const cartItem = await Cart.findOne({'items._id':productId}).populate('items.product');
        const productPrice = cartItem.items.find(item => item._id.toString()=== productId.toString()).product.product_price;
        const cart = await Cart.findOneAndUpdate(
            {'items._id':productId},
            {
                $inc:{
                    'items.$.quantity': 1,
                    totalQuantity:1,
                    totalPrice:productPrice,
                }
                
            },
            {new:true}
        );
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports.decrementQuantity = async (req,res)=>{
    const productId = req.params.itemId;
    console.log("decreemnt productid ",productId)
    try {
        const cartItem = await Cart.findOne({'items._id':productId}).populate('items.product');
        const productPrice = cartItem.items.find(item => item._id.toString()=== productId.toString()).product.product_price;
        const cart = await Cart.findOneAndUpdate(
            { 'items._id': productId },
            {
                $inc: {
                    'items.$.quantity': -1,
                    totalQuantity: -1, 
                    totalPrice: -productPrice,
                }
            },
            { new: true }
        );
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

