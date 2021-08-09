import express from 'express';
import cors from 'cors';
import { connectDB } from '../src/db.js';

const app = express();

app.set('PORT', 3000);
app.use(cors());
app.use(express.json);
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

connectDB();

app.listen( process.env.PORT || app.get('PORT'), () => {
    console.log(`Server started on port ${app.get('PORT')}`);
});