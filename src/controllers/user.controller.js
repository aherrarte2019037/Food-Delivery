import UserModel from '../models/user.model.js';
import { isValidId } from '../utils/validators.js';
import Passport from 'passport';
import { uploadCloudStorage } from '../utils/cloudStorage.js';

export default class UserController {

    static async register(req, res) {
        try {
            const data = JSON.parse(req.body.user);
            if(!data) return res.status(500).send({ success: false, message:'Datos incompletos, intenta otra vez' });
        
            const files = req.files;
            if(files?.length > 0) {
                const imagePath = `image_${Date.now()}`;
                const url = await uploadCloudStorage(files[0], imagePath);
                data.image = url;
            }

            data.image = data.image ?? undefined;
            const user = await UserModel.create(data);

            res.status(201).send({ success: true, message: 'Registro exitoso', data: user })

        } catch (error) {
            if( error?.message === 'User validation failed: email: email already exists' ) {
                return res.status(500).send({ success: false, message:'Correo en uso, intenta con otro' });
            }
            res.status(500).send({ success: false, message: 'Error al registrarse' });
        }
    }

    static login(req, res, next) {
        if( !req.body?.password || !req.body?.email ) return res.status(500).send({ success: false, message: 'Faltan datos' });
        Passport.authenticate( 'authenticate_user', {session: false}, (error, user, message) =>{
        
            if(error || !user) {
                res.status(500).send({ success: false, message: message.error });
    
            } else {
                res.status(200).send({ success: true, message: 'Inició de sesión exitoso', data: message });
            }
    
        })(req, res, next);
    }

    static async getById(req, res) {
        try {
            const id = req.params.id;
            if( !isValidId(id) ) return res.status(400).send({ success: false, message: 'Id inválido' })
            
            const user = await UserModel.findById(id);
            if( !user ) return res.status(404).send({ success: false, message: 'Usuario no encontrado' });
            res.status(200).send({ success: true, message: 'Usuario encontrado', data: user });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener usuario', error });
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