const Cart = require('../model/schema/cartSchema')
const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')
const Coupon = require('../model/schema/coupenSchema')
const Order = require('../model/schema/orderSchema')

module.exports.viewCart = async (req,res)=>{
    try{
        const {userId} = req.query;
        const cart = await Cart.findOne({user:userId}).populate({
            path:'items.product',
            populate: [
                {
                  path: 'category_name',
                  model: 'Category',
                },
                {
                  path: 'variations.size',
                  model: 'Size',
                },
              ],
        })
        const coupons = await Coupon.find({})
        console.log("cart",cart)
        if(cart){
        res.render('user/cart',{cart,coupons})
        }else{
            res.render('user/emptyCart')
        }    
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }

}

module.exports.getCart = async (req,res)=>{
    try {
        const { userId } = req.query
        const cart = await Cart.findOne({user:userId}).populate({
            path:'items.product',
            populate: [
                {
                  path: 'category_name',
                  model: 'Category',
                },
                {
                  path: 'variations.size',
                  model: 'Size',
                },
              ],
        })
        const coupons = await Coupon.find({})
        console.log("cart",cart)
        if(cart){
        res.json({cart,coupons})
        }else{
            res.render('user/emptyCart')
        }
    } catch (error) {
        console.log(error)
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

// function generateOrderNumber() {
//     const timestamp = Date.now().toString(36).toUpperCase();
//     const randomString = Math.random().toString(36).substring(2, 4).toUpperCase();
//     return `${timestamp}-${randomString}`;
//   }

module.exports.postCheckout = async (req,res)=>{
    // try {
    //     const { userId, cart, discountTotal } = req.body;

    //     const order = new Order({
    //         user:userId,
    //         items:cart.items,
    //         totalPrice:discountTotal,
    //         // status:'Pending'
    //     })
    //     order.orderNumber = generateOrderNumber();
    //     const savedOrder = await order.save()
    //     res.status(201).json({orderId:savedOrder._id})
    // } catch (error) {
    //     console.error(error)
    //     res.status(500).json({message:"Internal server error"})
    // }
}

module.exports.getCoupon = async (req,res)=>{
    try {
      const {value} = req.query;
      const coupon = await Coupon.findById(value)
      if(!coupon){
        return res.status(404).json({error:"Coupon not found"})
      }
      console.log(coupon)
      res.status(200).json(coupon)
    } catch (error) {
      
    }
  }

  module.exports.saveCouponToCart = async (req,res)=>{
    try {
        console.log("this is working")
        const {couponId,userId:userId} = req.query;
        if(!userId && couponId){
            return res.status(400).json({error:'Userid or coupon is missing'})
        }
        const existingCoupon = await Coupon.findById(couponId);
        if(!existingCoupon){
            return res.status(404).json({error:"Coupon not found"})
        }

        let userCart = await Cart.findOne({user:userId})
        if(!userCart){
            return res.status(404).json({message:"cart not found"})
        }
        userCart.coupon = existingCoupon._id;
        await userCart.save()
        console.log(userCart)
        return res.status(200).json({message:"Coupon saved to cart successfully ",cart:userCart})
    } catch (error) {
        console.error(error)
    }
  }

  module.exports.removeCouponFromCart = async (req,res)=>{
    try {
        console.log("this is working remove")
    } catch (error) {
        
    }
  }