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

  module.exports.changeStatus = async (req,res)=>{
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(orderId,status)
    console.log("this works")
    try {
        let updateFields = {status,delivered:status==="Delivered"};

        if(status==="Cancelled"){
          updateFields = {...updateFields,delivered:false}
        }

        const order = await Orders.findByIdAndUpdate(
          orderId,
          {$set:updateFields},
          {new:true}
        )

        if(!order){
            return res.status(404).json({error:'Order not found'})
        }
        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error)
    }
  }