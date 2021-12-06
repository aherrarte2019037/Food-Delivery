import express from 'express';
import { readFile } from 'fs/promises'
import cors from 'cors';
import { connectDB } from '../src/db.js';
import UserRoutes from './routes/user.route.js';
import ProductCategoryRoutes from './routes/product/category.route.js';
import ProductRoutes from './routes/product/product.route.js';
import CartRoutes from './routes/cart.route.js';
import OrderRoutes from './routes/order.route.js';
import AddressRoutes from './routes/address.route.js';
import ProductCategoryController from './controllers/product/category.controller.js'
import Passport from 'passport';
import './auth/passport.js';
import firebaseAdmin from 'firebase-admin';
import Server from 'socket.io';
import { trackDeliverySocket } from './sockets/order.socket.js';

const app = express();

const firebaseCredentials = JSON.parse(await readFile('./accountStorageKey.json', 'utf-8'));

//Iniciar firebase
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseCredentials)
});

//Configuración
Passport.initialize();
app.set('PORT', 8000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

//Base de datos
connectDB();

//Rutas
app.use('/api/users/order', OrderRoutes);
app.use('/api/users/address', AddressRoutes);
app.use('/api/users/cart', CartRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/products/categories', ProductCategoryRoutes);
app.use('/api/products', ProductRoutes);

//Iniciar servidor
const server = app.listen( process.env.PORT || app.get('PORT'), () => {
    console.log(`Server started on port ${app.get('PORT')}`);
    ProductCategoryController.createDefaultCategory();
});

//Sockets
const io = Server(server);
trackDeliverySocket(io);