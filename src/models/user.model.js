import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';

const UserSchema = mongoose.Schema({
    email      : { type: String, required: [true, 'Email is required'], maxLength: 25, unique: true, uniqueCaseInsensitive: true },
    password   : { type: String, required: [true, 'Password is required'], minLength: 5, maxLength: 25 },
    firstName  : { type: String, required: [true, 'Firstname is required'], maxLength: 25 },
    lastName   : { type: String, required: [true, 'Lastname is required'], maxLength: 25 },
    image      : { type: String, default: 'avatarImage.png' },
    isAvailable: { type: Boolean, default: true },
    roles      : {
        type: [{
            name : { type: String, enum: ['CLIENT', 'RESTAURANT', 'DELIVERY'], default: 'CLIENT' },
            image: { type: String, default: 'roleImage.png' }
        }],
        default: { name: 'CLIENT', image: 'roleImage.png' }
    }
})

UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

UserSchema.pre( 'save', async function(next) {
    const user = this;
    if( !user.isModified('password') ) return next(); 

    const hashPassword = await bcrypt.hash( user.password, 10 );
    user.password = hashPassword;
});

UserSchema.methods.validPassword = async function(password) {
    return await bcrypt.compare( password, this.password )
};

UserSchema.methods.toJSON = function() {
    const user = this;
    const response = user.toObject();
    delete response.password;
    delete response.__v;
    return response;
};

export default mongoose.model( 'User', UserSchema );