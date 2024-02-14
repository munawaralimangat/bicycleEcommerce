const Orders = require('../model/schema/orderSchema')
const Product = require('../model/schema/productSchema')
const OrderCancelModel = require('../model/schema/orderCancelSchema');
const User = require('../model/schema/userSchema');

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

module.exports.getAllOrdersData = async (req,res)=>{
  try {
    const orders = await Orders.find()

    if(!orders){
      return res.status(404).json({error:"Orders not found"})
    }

    const Users = await User.countDocuments()

    const deliveredCount = orders.filter(order=> order.status==="Delivered").length;
    const notDeliveredCount = orders.filter(order=> order.status !== "Delivered" && order.status !== "Cancelled").length;
    const cancelledCount = orders.filter(order => order.status ==="Cancelled").length;

    //total revenue
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const totalYearOrders = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $cond: [{ $eq: ['$delivered', true] }, '$totalPrice', 0] } },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1
        }
      }
    ]);
    const totalYearRevenue = totalYearOrders.length>0 ?totalYearOrders[0].totalRevenue : 0;
    console.log(totalYearOrders)
    const totalOrders = totalYearOrders.length>0 ?totalYearOrders[0].totalOrders : 0;
    
    const totalMonthlyOrders = await Orders.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
          delivered: true,
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
          },
          totalSales: { $sum: '$totalPrice' },
          averageBillAmount: { $avg: '$totalPrice' },
        },
      },
      {
        $sort: {
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          totalSales: 1,
          averageBillAmount: 1,
        },
      },
    ]);

    const zeroArray = Array(12).fill(0);
    const monthIndexMap = {
      1: 0,  // January
      2: 1,  // February
      3: 2,  // March
      4: 3,  // April
      5: 4,  // May
      6: 5,  // June
      7: 6,  // July
      8: 7,  // August
      9: 8,  // September
      10: 9, // October
      11: 10, // November
      12: 11, // December
    };

    const totalSalesArray = zeroArray.map((_, index) => totalMonthlyOrders.find(monthData => monthData.month === (index + 1))?.totalSales || 0);
    const averageBillAmountArray = zeroArray.map((_, index) => totalMonthlyOrders.find(monthData => monthData.month === (index + 1))?.averageBillAmount || 0);

    console.log(totalSalesArray)
    console.log(averageBillAmountArray)

    //bar chart
    //total sales of a month , delivered: true
    // average bill amount of a month , delivered : true
    res.json({
      Users,
      deliveredCount,
      notDeliveredCount,
      cancelledCount,
      totalYearRevenue,
      totalOrders,
      totalSalesArray,
      averageBillAmountArray
    })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({error:"Internal server error"})
  }
}

  module.exports.changeStatus = async (req,res)=>{
    const { orderId } = req.params;
    const { status } = req.body;
    try {
      const order = await Orders.findById(orderId).populate('items.product')
      if(!order){
        return res.status(404).json({error:"Order not found"})
      }

      if (order.delivered || order.status === 'Cancelled') {
        return res.json({ error: 'Status cannot be changed.' });
      }

      if(status === "Cancelled"){
        await handleCancelledStatus(order);

      }else if(status==="Delivered"){
        console.log("delivered")
        // await handleDeliveredStatus(order);
      }else if(status === 'Processing'|| status === 'Shipped'){
        await Orders.findByIdAndUpdate(orderId, { $set: { status, delivered: false } }, { new: true });
        return res.status(200).json({ message: 'Order status updated successfully' });
      }else{
        return res.status(400).json({error:"Invalid status update"})
      }

      const updatedOrder = await Orders.findByIdAndUpdate(
        orderId,
        {$set:{status,delivered:status==="Delivered"}},
        {new:true}
      );

      if(!updatedOrder){
        return res.status(404).json({error:"Order not found"})
      }
      res.status(200).json({message:"Order status updated successfully"})
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
  }


  async function handleCancelledStatus(order){
    
    for(const item of order.items){
      const productId = item.product._id;
      const sizeId = item.product.variations[0].size;
      const quantityToRestore = item.quantity;

      await Product.findOneAndUpdate(
        {_id:productId,"variations.size":sizeId},
        {$inc:{"variations.$.quantity":quantityToRestore}}
      )
    }
  }

  //order request page

  module.exports.viewOrderRequestPage = async (req,res)=>{
    try {
      const orderRequests = await OrderCancelModel.find()
      console.log(orderRequests)
      
      res.render('admin/adminOrderRequests',{orderRequests})
    } catch (error) {
      res.status(500).json({ error: "Error fetching order request" })
    }
  }

  module.exports.AcceptcancellOrder = async (req,res)=>{
    try {
        const orderId = req.params.orderId;
        const reqId = req.body.id;

        console.log(reqId)
        console.log(orderId)

        const order = await Orders.findById(orderId).populate('items.product');

        if(!order){
            return res.status(404).json({error:"Order not found"})
        }

        if(order.status !== "Cancelled" || order.status !== "Delivered"){
            
            for(const item of order.items){
                console.log(item.product)
                const product = await Product.findById(item.product);
                console.log(product.variations[0].quantity)

                if(product){
                    product.variations[0].quantity += item.quantity
                    await product.save()
                }
            }
            order.status = "Cancelled";
            order.delivered = false;

            await order.save()

            await OrderCancelModel.findOneAndUpdate(
              { order: orderId },
              { $set: { accept: true } },
              { new: true, upsert: true }
          );

            return res.status(200).json({message:"Order cancelled successfully"})
        }else{
            return res.status(400).json({error:"Order cannot be cancelled"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal Server error"})
    }
}


  // module.exports.changeStatus = async (req,res)=>{
  //   const { orderId } = req.params;
  //   const { status } = req.body;
  //   try {
  //       let updateFields = {status,delivered:status === "Delivered"};

  //       if(status==="Cancelled"){
  //         updateFields = {...updateFields,delivered:false}
  //       }

  //       const order = await Orders.findById(orderId).populate('items.product')

  //       if(order){
  //         for(const item of order.items){
  //           const productId = item.product._id;
  //           const sizeId = item.product.variations[0].size;
  //           const quantitytoRestore = item.quantity;
  //           console.log(productId,sizeId,quantitytoRestore)
            
  //           let updated = await Product.findOneAndUpdate(
  //             {_id:productId,'variations.size':sizeId},
  //             {$inc:{'variations.$.quantity':quantitytoRestore}}
  //           )
  //           console.log(updated)
  //         }
  //       }

  //       const UpdateOrder = await Orders.findByIdAndUpdate(
  //         orderId,
  //         {$set:updateFields},
  //         {new:true}
  //       )

  //       if(!UpdateOrder){
  //           return res.status(404).json({error:'Order not found'})
  //       }
  //       res.status(200).json({ message: 'Order status updated successfully', order });
  //   } catch (error) {
  //       console.error(error)
  //   }
  // }