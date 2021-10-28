import AddressModel from '../models/address.model.js';

export default class UserController {

    static async getAllByUser(req, res) {
        try {
            const user = req.body.user;            
            const addresses = await AddressModel.find({ user: user._id }); 

            res.status(200).send({ success: true, message: 'Direcciones obtenidas', data: addresses });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener direcciones', error, data: [] });
        }
    }

    static async create(req, res) {
        try {
            const data = req.body;
            const user = req.body.user; 

            if (!data.name || !data.references || !data.address) {
                return res.status(500).send({ success: false, message: 'Datos incompletos, intenta otra vez' });
            }

            if (data.latitude === null || data.latitude === undefined || data.longitude === null || data.longitude === undefined) {
                return res.status(500).send({ success: false, message: 'Datos incompletos, intenta otra vez' });
            }
            
            if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
                return res.status(500).send({ success: false, message: 'Coordenadas invalidas, intenta otra vez' });
            }

            data.user = user._id;
            data.createdAt = undefined;
            
            const addresses = await AddressModel.find({ user: user._id });
            const nameRepeated = addresses.some(address => address?.name === data.name);

            if (nameRepeated) return res.status(500).send({ success: false, message: 'Nombre de dirección en uso' });

            const address = await AddressModel.create(data);
            if (!address) return res.status(500).send({ success: false, message: 'Error al crear dirección' });

            res.status(200).send({ success: true, message: 'Dirección creada ', data: address });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al crear dirección', error });
        }
    }

}