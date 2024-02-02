const mongoose = require('mongoose')
const User = require('../schema/userSchema')

const orderCancelSchema = new mongoose.Schema({
    order:{
        type:mongoose.Types.ObjectId,
        ref:"Order",
    },
    accept:{
        type:Boolean,
        default:false
    }
})

const OrderCancelModel = mongoose.model('OrderCancelRequests',orderCancelSchema)

module.exports = OrderCancelModel