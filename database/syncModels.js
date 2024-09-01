// syncModels.js

import { sequelize } from './config.js';
// Importar y definir los modelos en el orden correcto según las dependencias

 
import Usuario from '../models/usuario.js';

 
 

// Función para sincronizar los modelos

const syncModels = async () => {
    try {
        await sequelize.sync({ force: false  }); // Cambia a force: true si deseas eliminar y recrear  tablas. manteiene los datos  alter:true
        console.log('Modelos sincronizados');
    } catch (error) {
        console.error('Error al sincronizar los modelos:', error);
        throw new Error('Error al sincronizar los modelos');
    }
}

export default syncModels;
