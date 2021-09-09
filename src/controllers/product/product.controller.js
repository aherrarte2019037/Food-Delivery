import ProductModel from '../../models/product/product.model.js';
import ProductCategoryModel from '../../models/product/category.model.js';
import { uploadCloudStorage } from '../../utils/cloudStorage.js';
import { isValidId } from '../../utils/validators.js';

export default class ProductController {
    
    static async recentProducts(req, res) {
        try {
            const recentProducts = await ProductModel.find({}).sort({ createdAt: 'descending'}).limit(6);
            res.status(200).send({ success: true, message: 'Productos recientes', data: recentProducts });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener productos', data: [] });
        }
    }
    
    static async create(req, res) {
        try {
            const data = JSON.parse(req.body.product);
            if(!data.name || !data.description || (!data.price && data.price !== 0)) return res.status(500).send({ success: false, message:'Datos incompletos, intenta otra vez' });

            data.images = ['assets/images/product-image.png'];
            data.createdAt = undefined;
            data._id = undefined;
            data.category = data.category ?? undefined;
            
            if(data.category) {
                if(!isValidId(data.category)) return res.status(400).send({ success: false, message: 'Categoría no encontrada' });
                const existsCategory = await ProductCategoryModel.findById(data?.category);
                if(!existsCategory) return res.status(400).send({ success: false, message: 'Categoría no encontrada' });
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
                return res.status(500).send({ success: false, message: 'Categoría ya creada, intenta con otra' });
            }

            res.status(500).send({ success: false, message: 'Error al crear producto' });
        }
    }

}
