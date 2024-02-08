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

    //group orders
    const groupedOrders = orders.reduce((acc,order)=>{
      const month = order.createdAt.getMonth()+1;
     
      const key = `${order.createdAt.getFullYear()}-${month}`;

      if(!acc[key]){
        acc[key]=[]
      }

      acc[key].push(order)
      return acc
    },{})
    
    const months = Object.keys(groupedOrders).sort()
    console.log(months)

    const monthlyData = months.map(month => {
      const monthlyOrders = groupedOrders[month];
      const revenue = monthlyOrders.reduce((total, order) => {
          if (order.status !== 'Cancelled' && order.status ==="Delivered") {
              total += order.totalPrice;
          }
          console.log("tt",total)
          return total;
      }, 0);
  
      const averageAmountPerBill = monthlyOrders.length > 0 ? 
          monthlyOrders.reduce((total, order) => total + order.totalPrice, 0) / monthlyOrders.length : 0;
  
      return {
          month,
          revenue,
          averageAmountPerBill
      };
  });

  const monthlyONS = await Orders.aggregate([
    {
      $match: { status: 'Delivered' },
    },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
        totalSales: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        year: '$_id.year',
        totalSales: '$totalSales',
        totalOrders: '$totalOrders',
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ])

  // console.log(monthlyONS)

  const chartData = monthlyONS.map(data => ({
    month:'${data.year}-${data.month}',
    totalSales:data.totalSales,
    totalOrders:data.totalOrders,
  }))


  // console.log(chartData)


  

    res.json({
      Users,
      deliveredCount,
      notDeliveredCount,
      cancelledCount,
      months,
      monthlyData,
      chartData
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