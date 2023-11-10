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
          productName,
          productPrice,
          productCategory,
          productQty,
          productSize,
          productColour,
          discountPrice,
          productImage
          //availablity
          //
        } = req.body;
    
        const newProduct = new Product({
          product_name:productName,
          product_price:productPrice,
          category_name:productCategory,
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
