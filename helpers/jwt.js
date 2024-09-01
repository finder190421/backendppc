import jwt  from 'jsonwebtoken';

export const generarJWT = ( uid, nombre,datoP,docm,tpuser,distrito,ubigeo) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid, nombre,datoP,docm,tpuser,distrito,ubigeo};

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token ) => {

            if ( err ){
                console.log(err);
                reject('No se pudo generar el token');
            }

            resolve( token );

        })


    })
}


