const Orders = require('../model/schema/orderSchema')

module.exports.viewOrders = async (req, res) => {
    try {
      const orders = await Orders.find()
        .populate('user')
        .populate('shippingAddress');
  
      res.render('admin/adminOrders', { orders: orders });
    } catch (error) {
      res.status(500).json({ error: "Error fetching orders" });
    }
  }