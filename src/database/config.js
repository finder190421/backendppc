// dbConnection.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import tedious from 'tedious';
// Cargar variables de entorno
dotenv.config();

// Crear una instancia de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    timezone: 'America/Lima',
    dialect: 'mssql',
    dialectModule: tedious,  
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true
        }
    },
    define:{
                timestamps:true
    },
    logging: false // Desactiva el logging
 
});

// Probar la conexión
const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }
}

export { dbConnection, sequelize };
