const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')

module.exports.viewMountain = async (req, res) => {
    try {
        const mountainBikesCategories = await Category.find({ category_name: 'Mountain Bikes' });

        if (!mountainBikesCategories || mountainBikesCategories.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const categoryIds = mountainBikesCategories.map(category => category._id);

        let mountainBikesProducts;

        const sortOption = req.query.sort;

        if (sortOption === 'lowToHigh') {
            mountainBikesProducts = await Product.find({ category_name: { $in: categoryIds } }).sort({ product_price: 1 });
        } else if (sortOption === 'highToLow') {
            mountainBikesProducts = await Product.find({ category_name: { $in: categoryIds } }).sort({ product_price: -1 });
        } else {
            // Default sorting or no sorting
            mountainBikesProducts = await Product.find({ category_name: { $in: categoryIds } });
        }

        console.log("Mountain Bikes Products:", mountainBikesProducts);
        res.render('user/mountainBikes', { mountainBikesProducts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.viewRoadBikes = async (req, res) => {
    try {
        const roadBikesCategories = await Category.find({ category_name: "Road Bikes" });

        if (!roadBikesCategories || roadBikesCategories.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const categoryIds = roadBikesCategories.map(category => category._id);

        let roadBikesProducts;

        const sortOptions = req.query.sort;
        if (sortOptions === "lowToHigh") {
            roadBikesProducts = await Product.find({ category_name: { $in: categoryIds } }).sort({ product_price: 1 });
        } else if (sortOptions === "highToLow") {
            roadBikesProducts = await Product.find({ category_name: { $in: categoryIds } }).sort({ product_price: -1 });
        } else {
            roadBikesProducts = await Product.find({ category_name: { $in: categoryIds } });
        }

        console.log("road bikes ", roadBikesProducts);
        res.render('user/roadBikes', { roadBikesProducts });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
