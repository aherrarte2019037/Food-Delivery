import UserModel from '../models/user.model.js';
import { isValidId } from '../utils/validators.js';
import Passport from 'passport';
import { uploadCloudStorage } from '../utils/cloudStorage.js';
import CartController from './cart.controller.js';

export default class UserController {

    static async register(req, res) {
        try {
            const data = JSON.parse(req.body.user);
            if(!data) return res.status(500).send({ success: false, message:'Datos incompletos, intenta otra vez' });

            data.image = undefined;
            data.createdAt = undefined;
            data._id = undefined;
            
            const user = await UserModel.create(data);
            CartController.createCart(user._id);

            const files = req.files;
            if(files?.length > 0) {
                const imagePath = `image_${Date.now()}`;
                const url = await uploadCloudStorage(files[0], imagePath);
                const userWithImage = await UserModel.findByIdAndUpdate(user._id, { image: url });
                return res.status(201).send({ success: true, message: 'Registro exitoso', data: userWithImage })
            }

            res.status(201).send({ success: true, message: 'Registro exitoso', data: user })

        } catch (error) {
            if(error?.errors?.email && error?.errors?.email?.kind === 'unique') {
                return res.status(500).send({ success: false, message: 'Correo en uso, intenta con otro' });
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

    static getUserAuthenticated(req, res) {
        try {
            const user = req.body.user;
            res.status(200).send({ success: true, message: 'Usuario autenticado', data: user });

        } catch (error) {
            console.log(error)
            res.status(500).send({ success: false, message: 'Error al obtener usuario autenticado' });
        }
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

    static async getByRole(req, res) {
        try {
            const role = req.params.role;
            if (!role || typeof role !== 'string') res.status(500).send({ success: false, message: 'Role incorrecto, intenta otra vez', error, data: [] });
            
            const users = await UserModel.find({ 'roles.name': role.toUpperCase() });
            res.status(200).send({ success: true, message: 'Usuarios por rol', data: users });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener usuarios', error, data: [] });
        }
    }

    static async getAll(req, res) {
        try {
            const users = await UserModel.find();
            res.status(200).send({ success: true, data: users });

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al obtener usuarios', error, data: [] });
        }
    }

    static async editUser(req, res) {
        try {
            const id = req.params.id;
            const editUser = req.body;
            if( !isValidId(id) ) return res.status(400).send({ success: false, message: 'Id inválido' })

            const user = await UserModel.findByIdAndUpdate(id, editUser);
            res.status(201).send({ success: true, message: 'Perfil editado', data: user })

        } catch (error) {
            if( error?.codeName === 'DuplicateKey' ) {
                return res.status(500).send({ success: false, message:'Correo en uso, intenta con otro' });
            }
            res.status(500).send({ success: false, message: 'Error al editar usuario', error });
        }    
    }

    static async editProfileImage(req, res) {
        try {
            const id = req.params.id;
            if( !isValidId(id) ) return res.status(400).send({ success: false, message: 'Id inválido' })

            const files = req.files;
            if(files?.length > 0) {
                const imagePath = `image_${Date.now()}`;
                const url = await uploadCloudStorage(files[0], imagePath);
                const userWithImage = await UserModel.findByIdAndUpdate(id, { image: url });
                return res.status(201).send({ success: true, message: 'Imagen de perfil editada', data: userWithImage })
            }

            res.status(500).send({ success: false, message: 'No hay imagen de perfil', data: user })

        } catch (error) {
            res.status(500).send({ success: false, message: 'Error al editar imagen de perfil' });
        }
    }

}