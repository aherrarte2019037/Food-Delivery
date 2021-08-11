import UserModel from '../models/user.model.js';

export default class UserController {

    static async register(req, res) {
        try {
            const data = req.body;
            if( data?.image === null ) data.image = undefined;
            const user = await UserModel.create(data);
            res.status(201).send({ success: true, message: 'Registro exitoso', data: user })

        } catch (error) {
            if( error?.message === 'User validation failed: email: email already exists' ) {
                return res.status(500).send({ success: false, message:'Correo en uso, intenta con otro', error });
            }
            res.status(500).send({ success: false, message:'Error al registrarse', error });
        }
    }

    static async getAll(req, res) {
        try {
            const users = await UserModel.find();
            res.status(200).send({ success: true, data: users });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener usuarios', error });
        }
    }

}