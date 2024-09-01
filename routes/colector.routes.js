import { Router } from 'express';
import { generarEnlaceUnico, usarEnlaceUnico, registrarDatosDirecto, registrarDatosConEnlace,decodificarYValidarToken } from '../controllers/colector.controller.js';

const router = Router();

// Ruta para generar un enlace único
router.post('/generar-enlace/:distrito/:ubigeo/:uid', generarEnlaceUnico);

// Ruta para usar un enlace único y registrar datos
router.post('/formulario/:token', registrarDatosConEnlace);

// Ruta para registrar datos directamente (sin enlace)
router.post('/registro-directo', registrarDatosDirecto);

// Ruta para verificar y usar un enlace único (si es necesario)
router.get('/usar-enlace/:token', usarEnlaceUnico);

router.get('/decodificar-token/:token', decodificarYValidarToken);
export default router;
