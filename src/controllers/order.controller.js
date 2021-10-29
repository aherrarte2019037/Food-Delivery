import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import { isValidId } from '../utils/validators.js';

export default class OrderController {

    static async create(req, res) {
        try {
            const data = req.body;
            const user = req.body.user;
            data.user = user._id; 

            if (!data.delivery || !data.address || !data.cart) {
                return res.status(500).send({ success: false, message: 'Datos incompletos, intenta otra vez' });
            }

            if (data.deliveryLatitude === null || data.deliveryLatitude === undefined || data.deliveryLongitude === null || data.deliveryLongitude === undefined) {
                return res.status(500).send({ success: false, message: 'Datos incompletos, intenta otra vez' });
            }
            
            if (typeof data.deliveryLatitude !== 'number' || typeof data.deliveryLatitude !== 'number') {
                return res.status(500).send({ success: false, message: 'Coordenadas invalidas, intenta otra vez' });
            }

            if (!isValidId(data.delivery)) return res.status(500).send({ success: false, message: 'Id de repartidor inválido, intenta con otro' });
            if (!isValidId(data.address)) return res.status(500).send({ success: false, message: 'Id de dirección inválido, intenta con otro' });
            if (!isValidId(data.cart)) return res.status(500).send({ success: false, message: 'Id de carrito inválido, intenta con otro' });

            const delivery = await UserModel.findById(data.delivery);
            if (!delivery) return res.status(500).send({ success: false, message: 'Repartidor no encontrado' });
            if (delivery?.roles?.findIndex(role => role?.name === 'DELIVERY') === -1) {
                return res.status(500).send({ success: false, message: 'Repartidor sin permisos requeridos' });
            }

            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    data[key] = data[key] ?? undefined;
                }
            }
            
            const order = await OrderModel.create(data);
            if (!order) return res.status(500).send({ success: false, message: 'Error al crear orden' });
            
            await order.populate('user').populate('delivery').populate('address').populate('cart').execPopulate();
            await order.populate('cart.products._id').execPopulate();

            let response = order.toObject();
            response.cart.products = response.cart.products.map(product => {
                return { quantity: product.quantity, product: product._id };
            });

            res.status(200).send({ success: true, message: 'Orden creada ', data: response });

        } catch (error) {
            console.log(error)
            res.status(500).send({ success: false, message: 'Error al crear orden', error });
        }
    }

}