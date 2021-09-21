import ProductModel from '../../models/product/product.model.js';
import ProductCategoryModel from '../../models/product/category.model.js';
import { uploadCloudStorage } from '../../utils/cloudStorage.js';

export default class ProductController {
    
    static async recentProducts(req, res) {
        try {
            const recentProducts = await ProductModel.find({}).sort({ createdAt: 'descending'}).limit(6);
            res.status(200).send({ success: true, message: 'Productos recientes', data: recentProducts });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener productos', data: [] });
        }
    }

    static async getGroupByCategory(req, res) {
        try {
            const productsGrouped = await ProductModel.aggregate([
                {"$group" : {_id:"$category", products: { $push: { name: '$name', description: '$description', price: '$price', _id: '$_id', avaialble: '$available' } }}}
            ]);

            await ProductCategoryModel.populate(productsGrouped, { path: '_id', select: 'name _id' })
            const result = productsGrouped.map( item => {
                const category = item._id;
                delete item._id;
                
                item.category = category;
                return item;
            });

            res.status(200).send({ success: true, message: 'Productos agrupados por categoría', data: result });
            
        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener productos', data: [] });
        }
    }
    
    static async create(req, res) {
        try {
            const data = JSON.parse(req.body.product);
            if(!data.name || !data.description || (!data.price && data.price !== 0)) return res.status(500).send({ success: false, message:'Datos incompletos, intenta otra vez' });

            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    data[key] = data[key] ?? undefined;
                }
            }

            data.images = ['assets/images/product-image.png'];
            
            if(data.category) {
                const existsCategory = await ProductCategoryModel.findOne({ name: new RegExp(data.category, 'i') });
                if(!existsCategory) return res.status(400).send({ success: false, message: 'Categoría no encontrada' });
                data.category = existsCategory._id;
            }
            
            const product = await ProductModel.create(data);
            const files = req.files;

            if(files?.length > 0) {
                let imageUrls = [];

                for (const file of files) {
                    imageUrls.push( await uploadCloudStorage(file, `image_${Date.now()}`) );
                }

                product.images = imageUrls;
                const productWithImages = await product.save({ validateBeforeSave: false });
                return res.status(201).send({ success: true, message: 'Producto creada', data: productWithImages })
            } 

            res.status(200).send({ success: true, message: 'Producto creado', data: product });
            
        } catch (error) {
            if(error?.errors?.price && error?.errors?.price?.kind === 'min') {
                return res.status(500).send({ success: false, message: error?.errors?.price?.message });
            }

            if(error?.errors?.name && error?.errors?.name?.kind === 'unique') {
                return res.status(500).send({ success: false, message: 'Producto ya creada, intenta con otro' });
            }

            console.log(error)

            res.status(500).send({ success: false, message: 'Error al crear producto' });
        }
    }

}
