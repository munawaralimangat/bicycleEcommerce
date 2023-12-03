
const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')
const Cart = require('../model/schema/cartSchema')
const Wishlist = require('../model/schema/wishlistSchema');


module.exports.productsView = async (req,res)=>{
    try {
      const product = await Product.find().populate('category_name')
        res.render('admin/adminProducts',{
          product:product
        })
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

        const productImage = req.file.filename;

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
    
        res.status(201).json({savedProduct});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports.updateProduct = async (req,res)=>{
  try {
    const productId = req.params.productId;
    const {
        productName,
        productPrice,
        productCategory,
        productQty,
        productSize,
        productColour,
        discountPrice,
    } = req.body;
    console.log(req.body)
    console.log(req.file)
  
    const productImage = req.file ? req.file.filename : undefined;

    let existingCategory = await Category.findOne({ category_name: productCategory });

    if (!existingCategory) {
        existingCategory = new Category({ category_name: productCategory });
        existingCategory = await existingCategory.save();
    }

    // Assuming you have a Product model with the appropriate schema
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            product_name: productName,
            product_price: productPrice,
            category_name: existingCategory._id,
            product_qty: productQty,
            product_size: productSize,
            product_colour: productColour,
            discount_price: discountPrice,
            product_imgurl: productImage,
        },
        { new: true } // to return the updated document
    );

    if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
        message: 'Product updated successfully',
        product: updatedProduct,
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
}

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product from wishlists
    await Wishlist.updateMany(
      { 'items.product': productId },
      { $pull: { items: { product: productId } } }
    );

    // Update total price in carts
    const carts = await Cart.find({ 'items.product': productId });

    for (const cart of carts) {
      const totalPrice = calculateTotalPrice(cart.items);
      await Cart.findByIdAndUpdate(cart._id, { $set: { totalPrice: totalPrice } });

      // Remove the product from the cart after updating the total price
      await Cart.updateOne(
        { _id: cart._id },
        { $pull: { items: { product: productId } } }
      );

      console.log("this workssddffdfefefeeere",carts);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

function calculateTotalPrice(items) {
  return items.reduce((total, item) => {
    const productPrice = item.product.product_price;
    const quantity = item.quantity;

    console.log('Product Price:', productPrice);
    console.log('Quantity:', quantity);

    if (isNaN(productPrice) || isNaN(quantity)) {
      console.error('Invalid product price or quantity:', item);
      return total;
    }

    return total + productPrice * quantity;
  }, 0);
}


