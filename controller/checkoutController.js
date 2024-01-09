const Order = require('../model/schema/orderSchema')
const Cart = require('../model/schema/cartSchema')
const Coupon = require('../model/schema/coupenSchema')
const Address = require('../model/schema/addressSchema')

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

        const addresses = await Address.find({ userId });
        const coupons = await Coupon.find({})

        if(cart){
        res.render('user/checkout',{cart,coupons,addresses})
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

