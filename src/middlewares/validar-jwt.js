 
import jwt from 'jsonwebtoken';

export const validarJWT = ( req, res, next ) => {

    // x-token headers
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid, nombre,datoP,docm,tpuser,distrito,ubigeo} = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );
         
        req.uid = uid;
        req.nombre = nombre;
        req.datoP = datoP;
        req.docm = docm;
        req.tpuser = tpuser;
        req.distrito = distrito;
        req.ubigeo = ubigeo;
        
       


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }



    next();
}


