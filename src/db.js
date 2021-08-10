import mongoose from 'mongoose';

export function connectDB() {
    const USER = 'root';
    const PASS = 'root';
    const PORT = 27017;
    const DB = 'food_delivery';

    mongoose.Promise = global.Promise;
    mongoose.set( 'returnOriginal', false );
    mongoose.set( 'useFindAndModify', false );
    mongoose.set( 'useNewUrlParser', true );
    mongoose.set( 'useUnifiedTopology', true );
    mongoose.set('useCreateIndex', true);

    mongoose.connect(`mongodb://${USER}:${PASS}@localhost:${PORT}/${DB}?authSource=admin`)
    .then( () => console.log('DB connected') )
    .catch( (error) => console.log(`DB connection failed: ${error}`) );
}