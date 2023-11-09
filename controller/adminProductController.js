const Product = require('../model/schema/productSchema')

module.exports.productsView = async (req,res)=>{
    const product = await Product.find()
    try {
        res.render('admin/adminProducts',{product:product})
      } catch (error){
        res.status(500).json({error:"error fetching product"});
      }     
}

module.exports.getProduct = async (req,res)=>{
    try {
        const productId = req.params.productId;
    
        const product = await Product.findById(productId);
    
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
          product_name,
          product_brand,
          product_imgurl,
          product_colour,
          product_qty,
          product_size,
          product_price,
          discount_price,
          //availablity
          //
        } = req.body;
    
        // Create a new Product instance
        const newProduct = new Product({
          product_name,
          product_brand,
          product_imgurl,
          product_colour,
          product_qty,
          product_size,
          product_price,
          discount_price,
        });
    
        // Save the new product to the database
        const savedProduct = await newProduct.save();
    
        res.status(201).json(savedProduct);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
