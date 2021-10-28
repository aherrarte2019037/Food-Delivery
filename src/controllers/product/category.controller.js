import ProductCategoryModel from '../../models/product/category.model.js';
import ProductModel from '../../models/product/product.model.js';
import { uploadCloudStorage } from '../../utils/cloudStorage.js';

export default class ProductCategoryController {

    static async createDefaultCategory() {
        const existsDefault = await ProductCategoryModel.findById('111111111111111111111111');
        if(!existsDefault) await ProductCategoryModel.create({ _id: '111111111111111111111111', name: 'Predeterminada', description: 'Categoría por defecto' });
    }

    static async getAll(req, res) {
        try {
            const categories = await ProductCategoryModel.find({}).sort({ createdAt: 'descending'});
            res.status(200).send({ success: true, message: 'Todas las categorías', data: categories });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener categorías', error, data: [] });
        }
    }

    static async getCategoriesWithProducts(req, res) {
        try {
            const products = await ProductModel.find().populate('category')

            let categories = products.map( product => product.category);
            categories = [...new Set(categories)];
            
            res.status(200).send({ success: true, message: 'Categorías con productos', data: categories });
            
        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener categorías', error, data: [] });
        }
    }

    static async getRecentCategories(req, res) {
        try {
            const recentCategories = await ProductCategoryModel.find({}).sort({ createdAt: 'descending'}).limit(6);
            res.status(200).send({ success: true, message: 'Categorías recientes', data: recentCategories });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener categorías', error, data: [] });
        }
    }

    static async create(req, res) {
        try {
            const data = JSON.parse(req.body.category);
            if(!data) return res.status(500).send({ success: false, message:'Datos incompletos, intenta otra vez' });

            data.image = undefined;
            data.createdAt = undefined;
            data._id = undefined;
            
            const category = await ProductCategoryModel.create(data);

            const files = req.files;
            if(files?.length > 0) {
                const imagePath = `image_${Date.now()}`;
                const url = await uploadCloudStorage(files[0], imagePath);
                const categoryWithImage = await ProductCategoryModel.findByIdAndUpdate(category._id, { image: url });
                return res.status(201).send({ success: true, message: 'Categoría creada', data: categoryWithImage })
            }

            res.status(201).send({ success: true, message: 'Categoría creada', data: category })

        } catch (error) {
            if( error?.message === 'ProductCategory validation failed: name: name already exists' ) {
                return res.status(500).send({ success: false, message:'Categoría ya creada, intenta con otra' });
            }
            res.status(500).send({ success: false, message: 'Error al crear categoría' });
        }
    }

}