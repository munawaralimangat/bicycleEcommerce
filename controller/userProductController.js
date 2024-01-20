const mongoose = require('mongoose');
const Product = require('../model/schema/productSchema');
const Size = require('../model/schema/sizeSchema')

module.exports.viewProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { size } = req.query;

        const product = await Product.findById(productId)
        .populate('category_name')
        .populate({
            path:'variations.size',
            model:'Size'
        })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let otherProduct = null;
        

        if (size) {
            console.log("size:" ,size)
            const sizeName = await Size.findOne({size_name:size})
            // const variations = product.variations.filter(variation => variation.size.size_name === size);

            if (sizeName) {
                const variationSizeId = sizeName._id;
                console.log(product.product_name)

                
                otherProduct = await Product.findOne({
                    _id: { $ne: productId },
                    product_name: product.product_name,
                    'variations.size': variationSizeId.toString()
                })

                console.log('Other Products:', otherProduct);

                console.log("Query criteria:", {
                _id: { $ne: productId },
                product_name: product.product_name,
                'variations.size': variationSizeId.toString()
                });

                if (otherProduct) {
                    console.log('Found another product with the same name and selected size:', otherProduct._id);
                    res.json({ otherProduct });
                    return;
                }
            }
        }

        console.log('No other products found with the same name and selected size');
        res.render('user/product', { product:product, otherProducts: [] });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.getAllProducts = async (req,res)=>{
    console.log("this works")
    try {
        // console.log(req.query)
        const selectedSizes = req.query.sizes;
        const filteredProducts = await Product.find({
            'variations.size': { $in: selectedSizes },
          })
          .populate('category_name') // Populate the 'category_name' field
          .populate('variations.size');
        res.json(filteredProducts)
    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.searchProduct = async (req,res)=>{
    console.log("1",req.query)
    try{
        const {q:productName} = req.query;
        console.log("pname",productName)
        if(!productName){
            return res.status(400).json({message:'Product name is required'})
        }
        const regex = new RegExp(productName,'i');

        const product = await Product.find({product_name:regex})

        if (product.length === 0) {
            // No products found
            return res.render('user/searchPage', { message: 'Product not found', products: [] });
          }

        res.render('user/searchPage',{products:product})
    }catch(error){
        console.error('error searching productrs',error)
        res.status(500).json({message:'Internal server error'})
    }
}

module.exports.searchWithSort = async (req, res) => {
    try {
        const  sortBy  = req.query.sort;
        console.log(req.query.sort)

        const productQuery = Product.find().sort({product_price:1});

        if (sortBy === 'HighToLow') {
            productQuery.sort({ product_price: -1 });
        }
        console.log("hello")
        const products = await productQuery.exec();

        if (products.length === 0) {
            return res.render('user/searchPage', { message: 'No products found', products: [] });
        }

        res.render('user/searchPage', { products });
    } catch (error) {
        console.error('Error searching products with sorting', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


