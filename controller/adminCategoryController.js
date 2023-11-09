const Category = require('../model/schema/categorySchema')

module.exports.getCategories = async (req,res)=>{
    const category = await Category.find()
    try {
        res.render('admin/adminCategories',{category:category})
      } catch (error){
        res.status(500).json({error:"error fetching users"});
      }
}

module.exports.addCategories = async (req,res)=>{
    
}