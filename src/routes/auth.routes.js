import express from 'express';
import { check } from 'express-validator';
import { crearUsuario ,loginUsuario,revalidarToken,changeStatusUser,cambiarPass} from "../controllers/auth.controller.js";
import { validarCampos } from '../middlewares/validar-campos.js';
 import { validarJWT }  from '../middlewares/validar-jwt.js';

const router = express.Router();

router.post(
    '/new',
    [ // middlewares
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidoP', 'El apellido paterno es obligatorio').not().isEmpty(),
        check('apellidoM', 'El apellido materno es obligatorio').not().isEmpty(),
        check('ndocumento', 'El número de documento es obligatorio').not().isEmpty(),
        
    
        validarCampos
    ],
    crearUsuario
);
 
router.post(
    '/', 
    [
     
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    loginUsuario
);

router.get('/renew', validarJWT ,revalidarToken );
router.post('/changepass' ,cambiarPass );

router.put('/editstatus/:id' ,changeStatusUser );
export default router;
    

 

