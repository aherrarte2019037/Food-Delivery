import Passport from 'passport';
import PassportJwt from 'passport-jwt';
import Jwt from 'jsonwebtoken';
import { Strategy } from 'passport-local';
import UserModel from '../models/user.model.js';
import { getTime, add, format  } from 'date-fns'

const secret = 'secret_key'

const authFields = {
    usernameField: 'email',
    passwordField: 'password'
};

const options = {
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}

Passport.use( 'authenticate_user', new Strategy( authFields, async(email, password, done) =>{
    try {
        const user = await UserModel.findOne({ email: email });
        if( !user ) return done(null, false, { logged: false, error: 'Usuario no registrado' });
        if( !await user.validPassword(password) ) return done(null, false, { logged: false, error: 'Correo o contraseña incorrecta' });
        
        return done(null, user, { ...user.toJSON(), token: getUserToken(user) });

    } catch(error) {
        return done(null, false, { error: 'Error al iniciar sesión' });
    }
}));

Passport.use( 'authorize_user', new PassportJwt.Strategy( options, async(jwtPayload, done) =>{
    try {
        const user = await UserModel.findById( jwtPayload.sub );
        user.password = undefined;
        return done( null, user, { authorized: true } );

    } catch(error) {
        return done(error, false, { authorized: false, error: error })
    }
}));

function getUserToken( user ) {
    return Jwt.sign({ sub : user.id, }, secret, { expiresIn: '1day' });
};