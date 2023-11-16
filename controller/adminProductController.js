
const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')


module.exports.productsView = async (req,res)=>{
    try {
      const product = await Product.find().populate('category_name')
        res.render('admin/adminProducts',{product:product})
      } catch (error){
        res.status(500).json({error:"error fetching product"});
      }     
}

module.exports.getProduct = async (req,res)=>{
    try {
        const productId = req.params.productId;
    
        const product = await Product.findById(productId).populate('category_name')
        console.log(product)
    
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
    
        res.json(product);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports.createProduct = async (req,res)=>{
    try {
        const {
          productName,
          productPrice,
          productCategory,
          productQty,
          productSize,
          productColour,
          discountPrice,
          //availablity
          //
        } = req.body;

        const productImage = req.file.filename;aaaa

        let existingCategory = await Category.findOne({category_name:productCategory})
        console.log(existingCategory);
        if(!existingCategory){
          existingCategory = new Category({category_name:productCategory})
          existingCategory = await existingCategory.save()
        }
        const newProduct = new Product({
          product_name:productName,
          product_price:productPrice,
          category_name:existingCategory._id,
          product_qty:productQty,
          product_size:productSize,
          product_colour:productColour,
          discount_price:discountPrice,
          product_imgurl:productImage,
        });
    
        const savedProduct = await newProduct.save();
    
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports.updateProduct = async (req,res)=>{
  try{
    const productId = req.params.productId
    console.log(productId)
  }catch(error){
    console.log('error')
  }
}
