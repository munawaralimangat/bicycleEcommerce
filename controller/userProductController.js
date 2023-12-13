const Product = require('../model/schema/productSchema');

module.exports.viewProduct = async (req,res)=>{
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        .populate('category_name')
        .populate({
            path: 'variations.color',
            model: 'Color',
        })
        .populate({
            path: 'variations.size',
            model: 'Size',
        });
        res.render('user/product',{product})
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
}
