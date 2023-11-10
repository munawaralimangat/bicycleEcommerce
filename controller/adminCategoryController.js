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
  console.log(req.body)
  try {
    const { categoryName} = req.body;
    console.log(categoryName)

    if (!categoryName) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const newCategory = new Category({ category_name:categoryName });
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}