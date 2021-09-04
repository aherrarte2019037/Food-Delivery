import ProductCategoryModel from '../../models/product/category.model.js';
import { uploadCloudStorage } from '../../utils/cloudStorage.js';

export default class ProductCategoryController {

    static async getRecentCategories(req, res) {
        try {
            const recentRecipes = await ProductCategoryModel.find({}).sort({ date: 'descending'});
            res.status(200).send({ success: true, message: 'Categorías recientes', data: recentRecipes });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener categorías' });
        }
    }

}