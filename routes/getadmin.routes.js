import express from "express";

import {
   obtenerTpUsuarios,
   obtenerDistritos,
   obtUserxTp,
   obtenerVecinosPorRecolector,
   obtUserSadmin,obtUseradmin
   
} from "../controllers/getadmin.controller.js";

const router = express.Router();
router.get("/tpusers", obtenerTpUsuarios);
router.get("/distritos", obtenerDistritos);
router.get("/usuarios/:tpUser/:ucreate", obtUserxTp);
router.get('/obt/datos/:usercreate', obtenerVecinosPorRecolector);

router.get('/spadmin/datos', obtUserSadmin);
router.get('/onlyadmin/datos/:ucreate', obtUseradmin);
export default router;
