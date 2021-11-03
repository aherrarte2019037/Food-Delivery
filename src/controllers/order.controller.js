import OrderModel from '../models/order.model.js';
import CartModel from '../models/cart.model.js';
import { isValidId } from '../utils/validators.js';

export default class OrderController {

    static async getPurchasedCount(req, res) {
        try {
            const orders = await OrderModel.countDocuments({});
            res.status(200).send({ success: true, message: 'Conteo de pedidos', data: orders ?? 0 });
            
        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener compras', error });
        }
    }

    static async groupByStatus(req ,res) {
        try {
            let orders = await OrderModel.find({}).populate('delivery address').populate('user', '-password').populate({ path: 'cart', populate: { path: 'products._id' } });            
            orders = orders.map(element => {
                let order = element.toObject();  
                const products = order.cart.products.map(product => new Object({ quantity: product.quantity, product: product._id } ));
                order.cart.products = products;

                return order;
            });
            
            const grouped = groupBy(orders, 'status');
            res.status(200).send({ success: true, message: 'Pedidos agrupados', data: grouped });
            
        } catch (error) {
            console.log(error)
            res.status(500).send({ success: false, message: 'Error al obtener pedidos', error });
        }
    }

    static async create(req, res) {
        try {
            const data = req.body;
            const user = req.body.user;
            data.user = user._id; 

            if (!data.address) return res.status(500).send({ success: false, message: 'Datos incompletos, intenta otra vez' });
            if (!isValidId(data.address)) return res.status(500).send({ success: false, message: 'Id de dirección inválido, intenta con otro' });

            const cart = await CartModel.findOne({ user: data.user });
            if (!cart) return res.status(500).send({ success: false, message: 'Carrito de compras no encontrado' });
            data.cart = cart._id;

            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    data[key] = data[key] ?? undefined;
                }
            }
            
            const order = await OrderModel.create(data);
            if (!order) return res.status(500).send({ success: false, message: 'Error al crear orden' });
            
            await order.populate('user').populate('delivery').populate('address').populate('cart').execPopulate();
            await order.populate('cart.products._id').execPopulate();
            order.user.password = undefined; 
            
            let response = order.toObject();
            response.cart.products = response.cart.products.map(product => {
                return { quantity: product.quantity, product: product._id };
            });

            res.status(200).send({ success: true, message: 'Orden creada ', data: response });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al crear orden', error });
        }
    }

}

function groupBy(array, property) {
    return array.reduce(function (acc, obj) {
      let key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
}