import OrderModel from '../models/order.model.js';
import CartModel from '../models/cart.model.js';
import UserModel from '../models/user.model.js';
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
            const user = req.body.user;
            let isDelivery = false;

            for (let index = 0; index < user.roles.length; index++) {
                if (user.roles[index].name === 'DELIVERY') {
                    isDelivery = true;
                    break;
                };
            }

            let deliveryQuery = {
                $and: [
                    { status: { $ne: 'PAGADO' } },
                    { delivery: user._id }
                ]
            };

            let orders = await OrderModel.find(isDelivery ? deliveryQuery : {}).populate('delivery address').populate('user', '-password').populate({ path: 'cart', populate: { path: 'products._id', populate: { path: 'category' } } });            
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

    static async assignDelivery(req, res) {
        try {
            const delivery = req.body.delivery;
            const orderId = req.params.id;

            if (!delivery || !orderId) return res.status(500).send({ success: false, message: 'Datos incompletos, intenta otra vez' });
            if (!isValidId(orderId)) return res.status(500).send({ success: false, message: 'Id de pedido inválido' });
            
            const foundDelivery = await UserModel.findById(delivery);
            if (!foundDelivery) return res.status(500).send({ success: false, message: 'Repartidor no encontrado' });

            const order = await OrderModel.findByIdAndUpdate(orderId, { delivery: delivery, status: 'DESPACHADO' });
            if (!order) return res.status(500).send({ success: false, message: 'Error al asignar repartidor', error });
            
            await order.populate('delivery address').populate('user', '-password').populate({ path: 'cart', populate: { path: 'products._id', populate: { path: 'category' } } }).execPopulate();
            
            let response = order.toObject();  
            const products = response.cart.products.map(product => new Object({ quantity: product.quantity, product: product._id } ));
            response.cart.products = products;

            res.status(200).send({ success: true, message: 'Repartidor asignado', data: response });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al asignar repartidor', error });
        }
    }

    static async edit(req, res) {
        try {
            const order = req.params.id;
            const updateData = req.body;
            delete updateData.user;

            const orderFound = await OrderModel.findById(order);
            if (!orderFound ) return res.status(500).send({ success: false, message: 'Pedido no encontrado' });

            if (updateData.status) updateData.status = updateData.status.toUpperCase();

            const orderEdited = await OrderModel.findByIdAndUpdate(order, updateData);
            if (!orderEdited ) return res.status(500).send({ success: false, message: 'Error al editar pedido' });

            await orderEdited.populate('delivery address').populate('user', '-password').populate({ path: 'cart', populate: { path: 'products._id', populate: { path: 'category' } } }).execPopulate();

            let response = orderEdited.toObject();  
            const products = response.cart.products.map(product => new Object({ quantity: product.quantity, product: product._id } ));
            response.cart.products = products;

            res.status(201).send({ success: true, message: 'Orden editada', data: response });

        } catch (error) {
            console.log(error)
            res.status(500).send({ success: false, message: 'Error al editar pedido', error });
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