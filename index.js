import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
 
import authRoutes from "./src/routes/auth.routes.js";
import getAdminRoutes from "./src/routes/getadmin.routes.js";
import colectorRoutes from "./src/routes/colector.routes.js";


import { dbConnection } from "./src/database/config.js";
import syncModels from './src/database/syncModels.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://ppc-roan.vercel.app', // URL de tu frontend
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-token', 'Authorization']
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 



 
// Iniciar la conexión a la base de datos
dbConnection().then(syncModels);
// Rutas de la API
app.use('/api/auth', authRoutes);

app.use('/api/getadmin', getAdminRoutes);
app.use('/api/colector', colectorRoutes);

 
// Iniciar el servidor
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
 