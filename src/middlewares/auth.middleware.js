import Passport from 'passport';

export default class AuthMiddleware {

    static authorizeUser( req, res, next ) {
        Passport.authenticate( 'authorize_user', {session: false}, (error, user, message) =>{
            if(error || !user ) {
                res.status(500).send({ success: false, message: 'No autorizado' });
        
            } else {
                req.body.user = user;
                next();
            }
        })(req, res, next);
    }

}