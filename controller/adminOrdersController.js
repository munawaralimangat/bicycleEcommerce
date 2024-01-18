const Orders = require('../model/schema/orderSchema')
const Product = require('../model/schema/productSchema')

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
        let updateFields = {status,delivered:status === "Delivered"};

        if(status==="Cancelled"){
          updateFields = {...updateFields,delivered:false}
        }

        const order = await Orders.findById(orderId).populate('items.product')

        if(order){
          for(const item of order.items){
            const productId = item.product._id;
            const sizeId = item.product.variations[0].size;
            const quantitytoRestore = item.quantity;
            console.log(productId,sizeId,quantitytoRestore)
            
            let updated = await Product.findOneAndUpdate(
              {_id:productId,'variations.size':sizeId},
              {$inc:{'variations.$.quantity':quantitytoRestore}}
            )
            console.log(updated)
          }
        }

        const UpdateOrder = await Orders.findByIdAndUpdate(
          orderId,
          {$set:updateFields},
          {new:true}
        )

        if(!UpdateOrder){
            return res.status(404).json({error:'Order not found'})
        }
        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error)
    }
  }