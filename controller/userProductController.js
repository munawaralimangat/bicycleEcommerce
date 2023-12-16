const mongoose = require('mongoose');
const Product = require('../model/schema/productSchema');
const Size = require('../model/schema/sizeSchema')

module.exports.viewProduct = async (req,res)=>{
    try {
        const productId = req.params.productId
        const {color,size} = req.query;

        let productQuery = Product.findById(productId).populate('category_name');

        // if(color){
        //     productQuery = productQuery.populate({
        //         path: 'variations.color',
        //         model: 'Color',
        //     });
        // }

        if (size) {
            productQuery = productQuery.populate({
                path: 'variations.size',
                model: 'Size',
            });
        }

        const product = await productQuery.exec()
        console.log(product)

        if(!product){
            return res.status(404).json({message:'product not found'})
        }
        res.render('user/product',{product});
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports.viewVariation = async (req,res)=>{
    try {
        const productId =req.params.productId;
        const size = req.query.size;

        const product = await Product.findById(productId)
        const sizeDocument = await Size.findOne({size})
        console.log(sizeDocument)

        if(!sizeDocument){
            return false
        }
        
        if(!product){
            return res.status(404).json({message:"product not found"})
        }
        // console.log(product.variations)


        const otherProduct = await Product.findOne({
            _id:{$ne:productId},
            product_name:product.product_name.toString(),
            'variations.size':sizeDocument._id
        })
        if(otherProduct){
            // res.render('user/product',{product:otherProduct})
            console.log("other found")
        }else{
            // res.render('user/product',{product})
            // console.log("other not found")
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }

}
