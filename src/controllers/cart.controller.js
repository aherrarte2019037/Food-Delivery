import CartModel from '../models/cart.model.js';
import { isValidId } from '../utils/validators.js';
import mongoose from 'mongoose';
import ProductModel from '../models/product/product.model.js';
import { addProductToShoppingCart } from '../utils/shoppingCart.js';

export default class CartController {

    static async getUserCart(req, res) {
        try {
            const user = new mongoose.Types.ObjectId(req.body.user._id)
            const cartFound = await CartModel.findOne({ user: user }).populate({ path: 'products._id', populate: { path: 'category' } });
            
            const products = cartFound.products.map(cartItem => new Object({ quantity: cartItem.quantity, product: cartItem._id }));
            let shoppingCart = {...cartFound._doc};
            shoppingCart.products = products;

            res.status(201).send({ success: true, message: 'Carrito de compras obtenido', data: shoppingCart });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener carrito', error });
        }
    }

    static async getProductsPurchased(req, res) {
        try {
            const user = new mongoose.Types.ObjectId(req.body.user._id)
            const cart = await CartModel.findOne({ user: user }).populate('products._id');

            let productsPurchased = [...new Set(cart.products)];
            productsPurchased = productsPurchased.map(cartItem => {
                return { quantity: cartItem.quantity, product: cartItem._id }
            });

            res.status(201).send({ success: true, message: 'Carrito de compras obtenido', data: productsPurchased });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener carrito', error });
        }
    }

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

            const products = shoppingCart.products.map(cartItem => new Object({ quantity: cartItem.quantity, product: cartItem._id }));
            let response = {...shoppingCart._doc};
            response.products = products;

            res.status(201).send({ success: true, message: 'Producto añadido al carrito', data: response });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al añadir producto al carrito', error });
        }
    }

    static async editCart(req, res) {
        try {
            const user = new mongoose.Types.ObjectId(req.body.user._id)
            const toUpdate = req.body;
            const cartUpdated = await CartModel.findOneAndUpdate({ user: user }, toUpdate);

            res.status(201).send({ success: true, message: 'Carrito de compras editado', data: cartUpdated });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al editar carrito', error });
        }
    }

}