const Order = require('../model/schema/orderSchema')

module.exports.viewCheckout = async (req,res)=>{
    try {
        const userId = req.query.userId;
        if(!userId){
            return res.status(400).json({message:"user ID is required"})
        }

        const orders = await Order.find({user:userId}).populate('items.product')
        console.log(orders)
        res.render('user/checkout',{orders})
    } catch (error) {
        console.error(error)
        res.status(500).json({message:"Internal server error"})
    }
}

