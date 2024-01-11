const Coupon = require('../model/schema/coupenSchema')

module.exports.viewOffers = async (req, res) => {
    try {
      const coupons = await Coupon.find();

      const currentDate = new Date()
      for(const coupon of coupons){
        if(coupon.validTo<currentDate){
            await Coupon.findByIdAndDelete(coupon._id)
        }
      }
      const updateCoupons = await Coupon.find({validTo: { $gte: currentDate }})
      res.render('admin/adminOffers', { coupons });
    } catch (error) {
      console.error('Error fetching coupons:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports.addCoupen = async (req,res)=>{
    try {
        const {
            code,
            discount,
            validFrom,
            validTo
        } = req.body;
        const existingCoupen = await Coupon.findOne({code})
        if(existingCoupen){
            return res.status(400).json({error:"Coupen code must be unique"})
        }

        const newCoupen = new Coupon({
            code,
            discount,
            validFrom,
            validTo
        })

        await newCoupen.save();
        res.status(201).json({message:"coupen added succesfully"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"internal server error"})
    }
}

module.exports.deleteCoupon = async (req,res)=>{
    const {id} = req.params;
    console.log("id",id)
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        if(!deletedCoupon){
            return res.status(400).json({message:"coupon not found"})
        }
        res.json({message:"coupon deleted succesfully"})
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}