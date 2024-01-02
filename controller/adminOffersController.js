const Coupon = require('../model/schema/coupenSchema')

module.exports.viewOffers = async (req, res) => {
    try {
      const coupons = await Coupon.find();
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