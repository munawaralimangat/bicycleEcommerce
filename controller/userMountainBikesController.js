const Product = require('../model/schema/productSchema')
const Category = require('../model/schema/categorySchema')

module.exports.viewMountain = async (req, res) => {
    try {
        const mountainBikesCategories = await Category.find({ category_name: 'Mountain Bikes' });

        if (!mountainBikesCategories || mountainBikesCategories.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const categoryIds = mountainBikesCategories.map(category => category._id);
        const mountainBikesProducts = await Product.find({ category_name: { $in: categoryIds } });

        console.log("Mountain Bikes Products:", mountainBikesProducts);
        res.render('user/mountainBikes', { mountainBikesProducts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
