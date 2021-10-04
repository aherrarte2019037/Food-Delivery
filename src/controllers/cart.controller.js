import CartModel from '../models/cart.model.js';
import { isValidId } from '../utils/validators.js';
import ProductModel from '../models/product/product.model.js';
import { addProductToShoppingCart } from '../utils/shoppingCart.js';

export default class CartController {

    static createCart(userId) {
        CartModel.create({ user: userId, products: [] });
    }

    static async addProductToCart(req, res) {
        try {
            const { product, quantity, user } = req.body;

            if (product === undefined || product === null || quantity === undefined || quantity === null) return res.status(500).send({ success: false, message: 'Faltan datos' });
            if (typeof quantity !== 'number' || quantity < 1) return res.status(500).send({ success: false, message: 'Cantidad inválida, formato incorrecto' });
            if (!isValidId(product)) return res.status(500).send({ success: false, message: 'Id de producto inválido, intenta con otro' });
            
            const productFound = await ProductModel.findById(product);
            if (!productFound) return res.status(500).send({ success: false, message: 'Producto no encontrado, intenta con otro' });

            let shoppingCart = await CartModel.findOne({ user: user._id });
            shoppingCart = addProductToShoppingCart(productFound, quantity, shoppingCart);
            await (await shoppingCart.save({ validateBeforeSave: false })).populate('products._id', '-__v').execPopulate();

            res.status(201).send({ success: true, message: 'Producto añadido al carrito',data: shoppingCart });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al añadir producto al carrito', error });
        }
    }

}