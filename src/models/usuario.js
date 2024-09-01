// models/usuario.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../database/config.js'; // Ajusta la ruta según sea necesario

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
     nombre: {
        type: 'VARCHAR(MAX)',
        allowNull: false
    },
    apellidoP: {
        type: 'VARCHAR(MAX)',
        allowNull: false
    },
    apellidoM: {
        type:'VARCHAR(MAX)',
        allowNull: false
    },
    datospersonales:{
        type:'VARCHAR(MAX)',
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: 'VARCHAR(MAX)',
        allowNull: true
    },
    ndocumento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tpUser:{
        type: 'VARCHAR(2)',
        allowNull: true,
    },
    ubigeo:{
        type: 'VARCHAR(6)',
            allowNull: true,      
    },
    fchCreacion: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // Por defecto, activo
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    celular:{
        type: 'VARCHAR(15)',
        allowNull: true,      
    },
    ucreate:{
        type: DataTypes.INTEGER,
        allowNull: false,      
    },
    distrito:{
        type: 'VARCHAR(255)',
        allowNull: true,      
    }
}, {
    tableName: 'tb_usuarios', // Asegúrate de que el nombre de la tabla coincida con el de tu base de datos
    schema: 'S_PERSONAS',
    timestamps: true // Ajusta según sea necesario
});

export default Usuario;