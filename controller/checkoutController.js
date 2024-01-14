const Order = require('../model/schema/orderSchema')
const Cart = require('../model/schema/cartSchema')
const Coupon = require('../model/schema/coupenSchema')
const Address = require('../model/schema/addressSchema')

module.exports.viewCheckout = async (req,res)=>{
    try{
        const {userId} = req.query;
        if(!userId){
          return res.render('user/userLogin')
        }
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
        .populate('coupon')

        const addresses = await Address.find({ userId });
        const coupons = await Coupon.find({})

        if(cart){
        res.render('user/checkout',{cart,coupons,addresses,search:false})
        }
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports.postAddress = async (req, res) => {
  try {

    const {
      userId,
      name,
      mobile,
      street,
      state,
      city,
      zip,
      country
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const newAddress = new Address({
      userId,
      name,
      mobile,
      street,
      state,
      city,
      zip,
      country,
    });
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" })
  }
}

// function generateOrderNumber() {
//     const timestamp = Date.now().toString(36).toUpperCase();
//     const randomString = Math.random().toString(36).substring(2, 4).toUpperCase();
//     return `${timestamp}-${randomString}`;
//   }

module.exports.placeOrder = async (req,res)=>{
  try {
    console.log("this works")
      const { userId, selectedAddressId, selectedPaymentMethod, couponDiscount } = req.body;
      console.log(req.body)
      const cart = await Cart.findOne({user:userId}).populate({
        path: 'items.product',
        populate: [
          { path: 'category_name', model: 'Category' },
          { path: 'variations.size', model: 'Size' },
        ],
      }).populate('coupon');
      if(!cart){
        return res.status(400).json({ success: false, error: 'Cart not found' });
      }
      const selectedAddress = await Address.findById(selectedAddressId);

      if (!selectedAddress) {
        return res.status(400).json({ success: false, error: 'Selected address not found' });
      }
      let totalPrice = cart.totalPrice +10
      if(cart.totalPrice){
        totalPrice -= couponDiscount
      }
      console.log(totalPrice,"total price")
  } catch (error) {
      console.error(error)
      res.status(500).json({message:"Internal server error"})
  }
}

