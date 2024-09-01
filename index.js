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
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Obtener __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const publicPath = path.join(__dirname, 'src', 'public');

// Middleware para servir archivos estáticos
app.use('/public', express.static(publicPath));




 
// Iniciar la conexión a la base de datos
dbConnection().then(syncModels);
// Rutas de la API
app.use('/api/auth', authRoutes);

app.use('/api/getadmin', getAdminRoutes);
app.use('/api/colector', colectorRoutes);


// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
