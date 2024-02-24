const User = require('../model/schema/userSchema')
const Address = require('../model/schema/addressSchema')
const Orders = require('../model/schema/orderSchema')
const Product = require('../model/schema/productSchema')
const Order = require('../model/schema/orderSchema')
const OrderCancelModel = require('../model/schema/orderCancelSchema')

module.exports.viewProfile = async (req,res)=>{
    try {
        const userId = req.query.userId;
        if(!userId){
            return res.redirect('/landing/login')
        }
        const addresses = await Address.find({userId:userId})

        if(!addresses){
            return res.status(404).json({error:"Address not found"})
        }
        const orders = await Orders.find({ user: userId })
        .populate('user')
        .populate('shippingAddress');
        res.render('user/userProfile',{addresses:addresses,orders:orders})
    } catch (error) {
        console.error(error)
    }
}

module.exports.getUserData = async (req,res)=>{
    try {
        const userId = req.params.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error:"user not found"})
        }
        res.json(user)
    } catch (error) {
        console.error("Error fetching user data",error);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports.updateUser = async (req,res)=>{
    try {
        const userId = req.params.userId;
        const {firstName,secondName,mobile,email} = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set:{
                    user_firstName:firstName,
                    user_secondName:secondName,
                    user_mobile:mobile,
                    user_email:email,
                }
            },
            {new:true}
        )
        // user.user_firstName = firstName || user.user_firstName;
        // user.user_secondName = secondName || user.user_secondName;
        // user.user_mobile = mobile || user.user_mobile;
        // user.user_email = email || user.user_email;

        if(!updatedUser){
            return res.status(404).json({error:"user not found"})
        }

        // const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.getOneAddress = async (req,res)=>{
    try {
        const addressId = req.params.addressId
        const addressDetails = await Address.findById(addressId)
        if(!addressDetails){
            return res.status(404).json({error:"address not found"})
        }
        console.log("address",addressDetails)
        res.json(addressDetails)
    } catch (error) {
        console.error("Error fetching address details",error);
        res.status(500).json({error:'Internal server error'})
    }
}

module.exports.editAddress = async (req,res)=>{
    try {
        const addressId = req.params.addressId
        console.log(addressId)
        const address = await Address.findById(addressId)

        if(!address){
            return res.status(404).json({error:"Address not found"})
        }

        address.name = req.body.name;
        address.mobile = req.body.mobile;
        address.street = req.body.street;
        address.state = req.body.state;
        address.city = req.body.city;
        address.zip = req.body.zip;
        address.country = req.body.country;

        await address.save()

        res.status(200).json({message:"Address updated successfully"})
    } catch (error) {
        console.error("Error updating address",error);
        res.status(500).json({error:"INternal server error"})
    }
}

module.exports.deleteAdrress = async (req,res)=>{
    try {
        const addressId = req.params.addressId;
        await Address.findByIdAndDelete(addressId)

        res.status(200).json({message:"Address deleted succesfully"})
    } catch (error) {
        console.error("Error deleting address");
        res.status(500).json({error:"Internal server error"})
    }
}

//orders
// module.exports.cancellOrder = async (req,res)=>{
//     try {
//         const orderId = req.params.orderId;
//         const order = await Orders.findById(orderId).populate('items.product');

//         if(!order){
//             return res.status(404).json({error:"Order not found"})
//         }

//         if(order.status !== "Cancelled" || order.status !== "Delivered"){
            
//             for(const item of order.items){
//                 console.log(item.product)
//                 const product = await Product.findById(item.product);
//                 console.log(product.variations[0].quantity)

//                 if(product){
//                     product.variations[0].quantity += item.quantity
//                     await product.save()
//                 }
//             }
//             order.status = "Cancelled";
//             order.delivered = false;

//             await order.save()
//             return res.status(200).json({message:"Order cancelled successfully"})
//         }else{
//             return res.status(400).json({error:"Order cannot be cancelled"})
//         }
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({error:"Internal Server error"})
//     }
// }

module.exports.cancelRequest = async (req,res)=>{
    const orderId = req.params.orderId
    console.log(orderId)
    await Order.findByIdAndUpdate(orderId,{
        $set:{
            status:"Cancelling"
        }
    })

    const orderCancelDetails = {
        order:orderId
    }

    const orderCancel = new OrderCancelModel(orderCancelDetails)

    await orderCancel.save()
    res.status(200).json({message:"cancel request sent successfully"})    
}