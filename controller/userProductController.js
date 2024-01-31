const mongoose = require('mongoose');
const Product = require('../model/schema/productSchema');
const Size = require('../model/schema/sizeSchema')
const Category = require('../model/schema/categorySchema')

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
    try {
        const selectedSizes = req.query.sizes;
        const selectedCategories = req.query.categories; // Add this line to get selected categories

        const filters = {};

        if (selectedSizes && selectedSizes.length > 0) {
            filters['variations.size'] = { $in: selectedSizes };
        }

        if (selectedCategories && selectedCategories.length > 0) {
            filters['category_name'] = { $in: selectedCategories };
        }

        const filteredProducts = await Product.find(filters)
            .populate('category_name')
            .populate('variations.size');

        res.json(filteredProducts);
    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.searchProduct = async (req, res) => {
    try {
        const { q: productName } = req.query;

        if (!productName) {
            return res.status(400).json({ message: 'Product name is required' });
        }

        const regex = new RegExp(productName, 'i');

        const product = await Product.find({ product_name: regex });

        const categories = await Category.find({ category_name: { $in: ["Mountain Bikes", "Road Bikes"] } });
        const catMap = {};
        categories.forEach(cat => {
            catMap[cat.category_name.toLowerCase().replace(/\s/g, '')] = cat._id;
        });

        const sizes = await Size.find({ size_name: { $in: ["Small", "Medium", "Large"] } });
        const sizeIdMap = {};
        sizes.forEach(size => {
            sizeIdMap[size.size_name.toLowerCase()] = size._id;
        });

        if (product.length === 0) {
            return res.render('user/searchPage', {
                message: 'Product not found',
                products: [],
                categories: catMap,
                sizes: sizeIdMap
            });
        }

        res.render('user/searchPage', { products: product, categories: catMap, sizes: sizeIdMap });
    } catch (error) {
        console.error('Error searching products', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.searchWithSort = async (req, res) => {
    try {
        const sortBy = req.query.sort;
        console.log(req.query.sort);

        const productQuery = Product.find().sort({ product_price: 1 });

        if (sortBy === 'HighToLow') {
            productQuery.sort({ product_price: -1 });
        }

        const products = await productQuery.exec();

        const categories = await Category.find({ category_name: { $in: ["Mountain Bikes", "Road Bikes"] } });
        const catMap = {};
        categories.forEach(cat => {
            catMap[cat.category_name.toLowerCase().replace(/\s/g, '')] = cat._id;
        });

        const sizes = await Size.find({ size_name: { $in: ["Small", "Medium", "Large"] } });
        const sizeIdMap = {};
        sizes.forEach(size => {
            sizeIdMap[size.size_name.toLowerCase()] = size._id;
        });

        if (products.length === 0) {
            return res.render('user/searchPage', {
                message: 'No products found',
                products: [],
                categories: catMap,
                sizes: sizeIdMap
            });
        }

        res.render('user/searchPage', { products, categories: catMap, sizes: sizeIdMap });
    } catch (error) {
        console.error('Error searching products with sorting', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



