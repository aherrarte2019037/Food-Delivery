import express from 'express';
import cors from 'cors';
import { connectDB } from '../src/db.js';
import UserRoutes from './routes/user.route.js';
import Passport from 'passport';
import './auth/passport.js';

const app = express();

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

//Iniciar servidor
app.listen( process.env.PORT || app.get('PORT'), () => {
    console.log(`Server started on port ${app.get('PORT')}`);
});