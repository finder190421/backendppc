import jwt from 'jsonwebtoken';
import { sequelize } from "../database/config.js";
import { QueryTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const secretKey = 'ppc2024*';

export const generarEnlaceUnico = async (req, res) => {
    try {
        const { distrito, ubigeo, uid } = req.params; // Asumiendo que tienes la información del usuario en req.user
        const token = jwt.sign({ distrito, ubigeo, uid }, secretKey, { expiresIn: '1h' });
        const baseUrl = process.env.BASE_URL;
        await sequelize.query(`
            INSERT INTO S_COLECTOR.tb_enlaces_unicos (token) 
            VALUES (:token)
        `, { 
            replacements: { token },
            type: QueryTypes.INSERT 
        });

        const enlace = `${baseUrl}/registrocelsim/${token}`;
        res.status(200).json({ ok: true, enlace });
    } catch (error) {
        console.error('Error al generar enlace único:', error);
        res.status(500).json({ ok: false, message: 'Error al generar enlace único' });
    }
};


export const usarEnlaceUnico = async (req, res) => {
    const { token } = req.params;

    try {
        // Verifica el token JWT
        jwt.verify(token, secretKey, async (err) => {
            if (err) {
                return res.status(400).json({ ok: false, message: 'Enlace inválido o expirado' });
            }

            // Verifica si el token ya ha sido usado
            const rows = await sequelize.query(`
                EXEC S_COLECTOR.sp_verificar_token_usado :token
            `, {
                replacements: { token },
                type: QueryTypes.SELECT 
            });

            if (rows.length === 0 || rows[0].utilizado) {
                return res.status(400).json({ ok: false, message: 'Enlace ya utilizado' });
            }

            // Marca el token como utilizado
            await sequelize.query(`
                UPDATE S_COLECTOR.tb_enlaces_unicos 
                SET utilizado = 1 
                WHERE token = :token
            `, {
                replacements: { token },
                type: QueryTypes.UPDATE 
            });

            res.status(200).json({ ok: true, message: 'Datos registrados correctamente' });
        });
    } catch (error) {
        console.error('Error al usar enlace único:', error);
        res.status(500).json({ ok: false, message: 'Error al registrar los datos' });
    }
};

export const registrarDatosDirecto = async (req, res) => {
    const { ubigeo, distrito, datospersonales, celular, sector, ndocumento, usercreate } = req.body;

    try {

        const [existingRecord] = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM S_COLECTOR.tb_vecinos_celulares
            WHERE ndocumento = :ndocumento
        `, {
            replacements: { ndocumento },
            type: QueryTypes.SELECT
        });

        if (existingRecord.count > 0) {
         
            return res.status(500).json({ ok: false, message: 'El número de documento ya está registrado' });
        }
        await sequelize.query(`
            EXEC S_COLECTOR.sp_insertar_vecino 
            @ubigeo = :ubigeo, 
            @distrito = :distrito, 
            @datospersonales = :datospersonales, 
            @celular = :celular, 
            @sector = :sector, 
            @ndocumento = :ndocumento, 
            @usercreate = :usercreate
        `, {
            replacements: { ubigeo, distrito, datospersonales, celular, sector, ndocumento, usercreate },
            type: QueryTypes.INSERT
        });
        res.status(200).json({ ok: true, message: 'Datos registrados correctamente' });
    } catch (error) {
        console.error('Error al registrar los datos:', error);
        res.status(500).json({ ok: false, message: 'Error al registrar los datos' });
    }
};

export const registrarDatosConEnlace = async (req, res) => {
    const { token } = req.params;
    const { ubigeo, distrito, datospersonales, celular, sector, ndocumento, usercreate } = req.body;

    try {
        const [existingRecord] = await sequelize.query(`
            SELECT COUNT(*) as count
            FROM S_COLECTOR.tb_vecinos_celulares
            WHERE ndocumento = :ndocumento
        `, {
            replacements: { ndocumento },
            type: QueryTypes.SELECT
        });

        if (existingRecord.count > 0) {
            return res.status(500).json({ ok: false, message: 'El número de documento ya está registrado' });
        }
        jwt.verify(token, secretKey, async (err) => {
            if (err) {
                return res.status(400).json({ ok: false, message: 'Enlace inválido o expirado' });
            }

            const rows = await sequelize.query(`
                EXEC S_COLECTOR.sp_verificar_token_usado :token
            `, {
                replacements: { token },
                type: QueryTypes.SELECT 
            });

            if (rows.length === 0 || rows[0].utilizado) {
                return res.status(400).json({ ok: false, message: 'Enlace ya utilizado' });
            }

            await sequelize.query(`
                EXEC S_COLECTOR.sp_insertar_vecino 
                @ubigeo = :ubigeo, 
                @distrito = :distrito, 
                @datospersonales = :datospersonales, 
                @celular = :celular, 
                @sector = :sector, 
                @ndocumento = :ndocumento, 
                @usercreate = :usercreate
            `, {
                replacements: { ubigeo, distrito, datospersonales, celular, sector, ndocumento, usercreate },
                type: QueryTypes.INSERT
            });

            await sequelize.query(`
                UPDATE S_COLECTOR.tb_enlaces_unicos 
                SET utilizado = 1 
                WHERE token = :token
            `, {
                replacements: { token },
                type: QueryTypes.UPDATE 
            });

            res.status(200).json({ ok: true, message: 'Datos registrados correctamente' });
        });
    } catch (error) {
        console.error('Error al registrar los datos con enlace:', error);
        res.status(500).json({ ok: false, message: 'Error al registrar los datos' });
    }
};
export const decodificarYValidarToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Decodificar el token
        const decodedToken = jwt.verify(token, secretKey);

        // Verificar si el token ya ha sido utilizado
        const tokenData = await sequelize.query(
            'SELECT utilizado FROM S_COLECTOR.tb_enlaces_unicos WHERE token = :token',
            {
                replacements: { token },
                type: QueryTypes.SELECT,
            }
        );

        if (tokenData.length === 0 || tokenData[0].utilizado) {
            
            return res.status(400).json({ ok: false, message: 'El enlace ya fue utilizado' });
        }

        // Retornar el token decodificado si es válido
        res.status(200).json({ ok: true, decodedToken });
    } catch (error) {
        console.error('Error al decodificar y validar el token:', error);
        res.status(500).json({ ok: false, message: 'Enlace inválido o expirado' });
    }
};