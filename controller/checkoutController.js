const Order = require('../model/schema/orderSchema')
const Cart = require('../model/schema/cartSchema')
const Coupon = require('../model/schema/coupenSchema')
const Address = require('../model/schema/addressSchema')
const Product = require('../model/schema/productSchema')
const Razorpay = require('razorpay')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


module.exports.viewCheckout = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.render('user/userLogin')
    }
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
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
    if (!cart || cart.items.length === 0) {
      console.log("Cart not found or empty");
      return res.redirect(`/brepublic/success?userId=${userId}`);
    }
    const addresses = await Address.find({ userId });
    const coupons = await Coupon.find({})

    if (cart) {
      res.render('user/checkout', { cart, coupons, addresses, search: false })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" })
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

module.exports.placeOrder = async (req, res) => {
  try {
    console.log("this works")
    const { userId, selectedAddressId, selectedPaymentMethod, couponDiscount } = req.body;
    console.log(req.body)
    const cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      populate: [
        { path: 'category_name', model: 'Category' },
        { path: 'variations.size', model: 'Size' },
      ],
    }).populate('coupon');
    if (!cart) {
      return res.status(400).json({ success: false, error: 'Cart not found' });
    }
    const selectedAddress = await Address.findById(selectedAddressId);

    if (!selectedAddress) {
      return res.status(400).json({ success: false, error: 'Selected address not found' });
    }
    let totalPrice = cart.totalPrice + 10;

    if (cart.totalPrice) {
      totalPrice -= couponDiscount
    }
    console.log(totalPrice, "total price")

    let paymentStatus;
    let paymentDetails;

    if (selectedPaymentMethod === "COD") {
      console.log("cod")
      paymentStatus = "Pending";
      paymentDetails = null;
      res.json("cod")
    } else if (selectedPaymentMethod === "Online") {
      console.log("online")
      const timestamp = Date.now()
      const uniqueReceiptId = `BR${timestamp}`

      try {
        const options = {
          amount:totalPrice*100,
          currency:'INR',
          receipt:uniqueReceiptId,
          payment_capture:1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        paymentStatus = "Pending"

        paymentDetails = {
          razorpayOrderId:razorpayOrder.id,
          razorpaySignature:razorpayOrder.signature,
        }
         res.json({ razorpayOrder: razorpayOrder }); 

      } catch (error) {
        console.error(error)
      }

    } else {
      return res.status(400).json({ success: false, error: 'Invalid payment method' });
    }

    const order = new Order({
      user: userId,
      orderNumber: generateOrderNumber(),
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
      paymentMethod: selectedPaymentMethod,
    })
    console.log("paymenthod", selectedPaymentMethod);
    await order.save();
    let productId
    let productQuantity
    let size

    for (const item of cart.items) {
      productId = item.product._id
      productQuantity = item.quantity
      size = item.product.variations[0]._id
      console.log(productId, "qty", productQuantity)
      console.log("size", size)

      let productUpdated = await Product.findOneAndUpdate(
        { _id: productId, 'variations._id': size },
        { $inc: { 'variations.$.quantity': -productQuantity } }
      )
      console.log("productupdt", productUpdated)
    }

    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], totalPrice: 0 }, $unset: { coupon: 1 }, totalQuantity: 0 }
    );
    // res.status(201).json({ success: true, message: 'Order created successfully', order })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

module.exports.successPayment = async (req,res)=>{
 try {
  const userId = req.query.userId;
  console.log(userId)
  if(!userId){
    return res.redirect(`/brepublic/cart?userId=${userId}`)
  }
   res.render('user/successPage')
 } catch (error) {
  console.error(error)
 }
}

