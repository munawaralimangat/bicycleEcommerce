
const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')
const Color = require('../model/schema/colorSchema')
const Size = require('../model/schema/sizeSchema')


module.exports.productsView = async (req,res)=>{
    try {
      const product = await Product.find()
      .populate('category_name')
      .populate({
        path: 'variations.size',
        model: 'Size',
      });

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
    
        const product = await Product.findById(productId)
        .populate('category_name')
        // .populate({
        //   path: 'variations.color',
        //   model: 'Color',
        // })
        .populate({
          path: 'variations.size',
          model: 'Size',
        });
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
    console.log("yoooohooooo")
      try {
          const {
            productName,
            productPrice,
            productCategory,
            productQty,
            productSize,
            // productColour,
            discountPrice,
          } = req.body;
          console.log(req.body,"this is reqbody")

          const frontImage = req.files.frontImage[0];
          const productImagesFiles = req.files.productImages

          let existingCategory = await Category.findOne({category_name:productCategory})

          if(!existingCategory){
            existingCategory = new Category({category_name:productCategory})
            existingCategory = await existingCategory.save()
          }
          
          const existingSize = await Size.findOne({size_name:productSize});
          const size = existingSize || new Size({size_name:productSize});
          const savedSize = await size.save()

          // const existingColor = await Color.findOne({color_name:productColour});
          // const color = existingColor || new Color({color_name:productColour});
          // const savedColor = await color.save();

          const productVariations = [{
            // color:savedColor._id,
            size:savedSize._id,
            quantity:productQty
          }]

          
          const productImages = productImagesFiles.map(file => ({ filename: file.filename }));
          const newProduct = new Product({
            product_name: productName,
            category_name: existingCategory._id,
            variations: productVariations,
            product_price: productPrice,
            discount_price: discountPrice,
            front_image:frontImage,
            product_images: productImages,
          });
      
          const savedProduct = await newProduct.save();
      
          res.status(201).json({message:savedProduct});
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
        // productColour,
        discountPrice,
    } = req.body;
  
    const frontImage = req.files.frontImage ? req.files.frontImage[0] : undefined;
    const additionalImages = req.files.additionalImages || [];
    console.log("front image: ",frontImage)
    console.log("images",additionalImages)

    let existingCategory = await Category.findOne({ category_name: productCategory });

    if (!existingCategory) {
        existingCategory = new Category({ category_name: productCategory });
        existingCategory = await existingCategory.save();
    }

        const existingSize = await Size.findOne({size_name:productSize});
        const size = existingSize || new Size({size_name:productSize});
        const savedSize = await size.save()

        // const existingColor = await Color.findOne({color_name:productColour});
        // const color = existingColor || new Color({color_name:productColour});
        // const savedColor = await color.save()

        const existingProduct = await Product.findById(productId);
        if(!existingProduct){
          return res.status(404).json({error:"product not found"})
        }

        const productVariations = [{
          // color:savedColor._id,
          size:savedSize._id,
          quantity:productQty
        }]

        existingProduct.product_name = productName;
        existingProduct.product_price = productPrice;
        existingProduct.category_name = existingCategory._id;
        existingProduct.product_qty = productQty;
        existingProduct.variations = productVariations,
        existingProduct.discount_price = discountPrice;

        if (frontImage) {
          existingProduct.front_image = frontImage;
        }
        if (additionalImages.length > 0) {
          existingProduct.product_images = additionalImages;
        }
        const updatedProduct = await existingProduct.save();

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

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




