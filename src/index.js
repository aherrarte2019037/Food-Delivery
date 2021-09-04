import express from 'express';
import { readFile } from 'fs/promises'
import cors from 'cors';
import { connectDB } from '../src/db.js';
import UserRoutes from './routes/user.route.js';
import ProductCategoryRoutes from './routes/product/category.route.js';
import Passport from 'passport';
import './auth/passport.js';
import firebaseAdmin from 'firebase-admin';

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
app.use('/api/users', UserRoutes);
app.use('/api/products/categories', ProductCategoryRoutes);

//Iniciar servidor
app.listen( process.env.PORT || app.get('PORT'), () => {
    console.log(`Server started on port ${app.get('PORT')}`);
});