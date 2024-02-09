const Order = require('../model/schema/orderSchema')
const User = require('../model/schema/userSchema')
const Cart = require('../model/schema/cartSchema')
const Coupon = require('../model/schema/coupenSchema')
const Address = require('../model/schema/addressSchema')
const Product = require('../model/schema/productSchema')
const Razorpay = require('razorpay')
const PDFDocument = require('pdfkit')

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
  const user = await User.findById(userId)
  if(!user){
    return res.redirect(`/brepublic/cart?userId=${userId}`)
  }
  const lastOrder = await Order.findOne({user:userId}).sort({ createdAt: -1 })
  .populate({
    path: 'items.product',
    model: 'Product',
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
  .populate({
    path: 'shippingAddress',
    model: 'Address',
  })
  .populate({
    path: 'user',
    model: 'User',
  });
  console.log(lastOrder)
   res.render('user/successPage',{userId,lastOrder})
 } catch (error) {
  console.error(error)
 }
}

module.exports.invoiceGenerate = async (req,res)=>{
  try {
    const orderId = req.params.orderId
  const order = await Order.findById(orderId)  .populate({
    path: 'items.product',
    model: 'Product',
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
  .populate({
    path: 'shippingAddress',
    model: 'Address',
  })
  .populate({
    path: 'user',
    model: 'User',
  });

  if (!order) {
    return res.status(404).send('Order not found');
  }

  const doc = new PDFDocument();
  const buffers = [];
  doc.on('data',(chunk)=> buffers.push(chunk));
  doc.on('end',()=>{
    const pdfBuffer = Buffer.concat(buffers)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
    res.send(pdfBuffer);
  })

  
  doc.text(`BicycleRepublic`, { align: 'center', fontSize: 54 });
  doc.moveDown(); // Move down a line
  
  
  // Add order details
  doc.text(`Order Date: ${order.createdAt.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, { fontSize: 12 });
  doc.text(`Customer: ${order.user.user_firstName}`, { fontSize: 12 });
  doc.text(`Invoice No: ${order.orderNumber}`, { fontSize: 12 });
  doc.text(`State: ${order.shippingAddress.state}`, { fontSize: 12 });
  doc.text(`City: ${order.shippingAddress.city}`, { fontSize: 12 });
  doc.moveDown();
  
  doc.text('Items List:', { fontSize: 14, underline: true });
  doc.moveDown();
  order.items.forEach((item) => {
      doc.text(`${item.product.product_name}: ${item.quantity} x ${item.product.product_price} = ${item.quantity * item.product.product_price}`, { fontSize: 12 });
  });
  
  const totalAmount = order.items.reduce((total, item) => total + item.quantity * item.product.product_price, 0);
  doc.moveDown();
  doc.text(`Gross Amount: $${totalAmount}`, { fontSize: 14, bold: true, align: 'right' });
  doc.text(`Shipping Charge: $${10}`, { fontSize: 14, bold: true, align: 'right' });
  doc.text(`Coupon discount: $${totalAmount-order.totalPrice+10}`, { fontSize: 14, bold: true, align: 'right' });
  doc.moveDown();
  doc.text(`Net Total Amount: $${order.totalPrice}`, { fontSize: 14, bold: true, align: 'right' });
  
  doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).send('Error generating invoice');
  }
}

