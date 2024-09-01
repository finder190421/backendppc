import { sequelize } from "../database/config.js";
import { QueryTypes } from "sequelize";


export const obtenerTpUsuarios = async(req,res) => {
    try {
        const tpuser = await sequelize.query(
            'EXEC S_MANTENIMIENTO.sp_obtener_tipos_usuarios',
            {
                 type: QueryTypes.SELECT
            }
        );

        res.status(200).json({
            ok: true,
            tpuser: tpuser
        });
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener las áreas por año',
            error: error.message
        });
    }
}

export const obtenerDistritos = async (req, res) => {
    const { search } = req.query;
     
    try {
        const distri = await sequelize.query(
            'EXEC S_MANTENIMIENTO.sp_obtener_ubigeo_distrito :searchTerm',
            {
                replacements: { searchTerm: search || null },
                type: QueryTypes.SELECT,
            }
        );

        res.status(200).json({
            distri
        });
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener los distritos',
            error: error.message,
        });
    }
};

export const obtUserxTp = async (req, res) => {
    const { ucreate,tpUser } = req.params;

    try {
        const users = await sequelize.query(
            'EXEC S_PERSONAS.sp_obtener_usuarios_por_tipo :tpUser,:ucreate',
            {
                replacements: { tpUser,ucreate },
                type: QueryTypes.SELECT
            }
        );

        const formattedUsers = users.map(user => ({
            id: user.id,
            datospersonales: user.datospersonales,
            ndocumento: user.ndocumento,
            distrito: user.distrito,
            celular: user.celular,
            email: user.email,
            tpUser: user.tpUser,
            tipoUsuario: user.tpusuario,
            activo: user.activo// Renombrando tpusuario a tipoUsuario
        }));

        res.status(200).json({
            ok: true,
            users: formattedUsers
        });
    } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener los usuarios por tipo',
            error: error.message
        });
    }
};



export const obtenerVecinosPorRecolector = async (req, res) => {
    const { usercreate } = req.params;
    
    try {
        const vecinos = await sequelize.query(`
            EXEC S_MANTENIMIENTO.sp_obtener_vecinos_por_recolector
            @usercreate = :usercreate
        `, {
            replacements: { usercreate },
            type: QueryTypes.SELECT
        });

        if (vecinos.length > 0) {
            // Desglosar la información usando .map()
            const desglosado = vecinos.map(vecino => ({
                vecino: vecino.vecino,
                distrito: vecino.distrito,
                celular: vecino.celular,
                sector: vecino.sector,
                ndocumento: vecino.ndocumento,
                recolector: vecino.recolector,
               // usercreate: vecino.usercreate
            }));

            res.status(200).json({ ok: true, data: desglosado });
        } else {
            res.status(404).json({ ok: false, message: 'No se encontraron vecinos para el recolector proporcionado' });
        }
    } catch (error) {
        console.error('Error al obtener vecinos:', error);
        res.status(500).json({ ok: false, message: 'Error al obtener vecinos' });
    }
};
//para superadmin
export const obtUserSadmin = async (req, res) => {
    try {
        const usuarios = await sequelize.query(`
            EXEC S_MANTENIMIENTO.sp_obtener_usuarios_con_datos
        `, { 
            type: QueryTypes.SELECT 
        });

        res.status(200).json({
            ok: true,
            usuarios: usuarios.map(usuario => ({
                id: usuario.id,
                datos: usuario.datos
            }))
        });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener los usuarios'
        });
    }
};

//paraadmin
export const obtUseradmin = async (req, res) => {
        const {ucreate} = req.params;
    try {
        const usuarios = await sequelize.query(`
            EXEC S_MANTENIMIENTO.sp_obtener_usuarios_con_datos_admin
            @ucreate = :ucreate
        `, { 
            replacements: { ucreate },
            type: QueryTypes.SELECT 
        });

        res.status(200).json({
            ok: true,
            usuarios: usuarios.map(usuario => ({
                id: usuario.id,
                datos: usuario.datos
            }))
        });
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({
            ok: false,
            message: 'Error al obtener los usuarios'
        });
    }
};
 