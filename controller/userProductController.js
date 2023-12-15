const Product = require('../model/schema/productSchema');

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

