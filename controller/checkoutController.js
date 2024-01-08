const Order = require('../model/schema/orderSchema')
const Cart = require('../model/schema/cartSchema')
const Coupon = require('../model/schema/coupenSchema')

module.exports.viewCheckout = async (req,res)=>{
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
        res.render('user/checkout',{cart,coupons})
        }else{
            res.render('user/emptyCart')
        }    
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}

