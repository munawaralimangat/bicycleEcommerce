const Category = require('../model/schema/categorySchema')

module.exports.categoriesView = async (req,res)=>{
    const category = await Category.find()
    try {
        res.render('admin/adminCategories',{category:category})
      } catch (error){
        res.status(500).json({error:"error fetching users"});
      }
}

module.exports.getCategories = async (req,res)=>{
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findById(categoryId)
    console.log(category)
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports.createCategories = async (req,res)=>{
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

module.exports.editCategory = async(req,res)=>{
  try {
    const categoryId = req.params.categoryId;
    const { editCategoryName } = req.body;

    if (!editCategoryName) {
      return res.status(400).json({ error: 'New category name is required.' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { category_name: editCategoryName },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error editing category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};