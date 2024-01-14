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

function generateOrderNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomString = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${timestamp}-${randomString}`;
  }

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
      let totalPrice = cart.totalPrice +10;

      if(cart.totalPrice){
        totalPrice -= couponDiscount
      }
      console.log(totalPrice,"total price")

      let paymentStatus;
      let paymentDetails;

      if(selectedPaymentMethod==="COD"){
        console.log("cod")
        paymentStatus = "Pending";
        paymentDetails = null;

      }else if(selectedPaymentMethod==="Online"){
        console.log("online")
        return res.json({message:"online payment is not ready yet"})

      }else{
        return res.status(400).json({ success: false, error: 'Invalid payment method' });
      }

      const order = new Order({
        user:userId,
        orderNumber:generateOrderNumber(),
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: selectedAddress._id,
        totalPrice,
        status: 'Pending',
        createdAt: new Date(),
        paymentStatus,
        paymentDetails: paymentDetails,
      })

      await order.save();
      // await Cart.findByIdAndUpdate({userId},{$set:{items:[]}})
      res.status(201).json({ success: true, message: 'Order created successfully', order })
  } catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

