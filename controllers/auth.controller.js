import bcrypt from "bcryptjs";
import { generarJWT } from "../helpers/jwt.js";
 
import Usuario from "../models/usuario.js";
import { sequelize } from "../database/config.js";
import { QueryTypes } from "sequelize";
 

export const crearUsuario = async (req, res) => {
  const {nombre,apellidoP,apellidoM,email,password,ndocumento,tpUser,ubigeo,celular,ucreate,distrito} = req.body;
  
  try {
    // Verificar si el username ya existe en la base de datos
    const existindocumento = await Usuario.findOne({ where: { ndocumento: ndocumento } });
    if (existindocumento) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario registrado con  ese número de documento",
      });
    }

    // Convertir los demás campos a mayúsculas
    const usuarioData = {    
      nombre: nombre.toUpperCase(),
      apellidoP: apellidoP.toUpperCase(),
      apellidoM: apellidoM.toUpperCase(),
      datospersonales: `${apellidoP} ${apellidoM} ${nombre}`.toUpperCase(),
      email: email ? email.toUpperCase() : null,
      ndocumento: ndocumento ? ndocumento.toUpperCase() : null,
      celular:celular,
      tpUser: tpUser, // Establecer el tipo de usuario como 'MPART'
      password: '', // Placeholder para la contraseña encriptada
      ubigeo: ubigeo ? ubigeo.toUpperCase() : null,
      fchCreacion: new Date(), // Fecha de creación
      ucreate:ucreate,
      distrito:distrito
    };

    // Encriptar la nueva contraseña
    const salt = bcrypt.genSaltSync();
    usuarioData.password = bcrypt.hashSync(password, salt);

    // Crear una nueva instancia de usuario con los datos procesados
    const usuario = Usuario.build(usuarioData);

    await usuario.save();
     
    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.nombre,
      msg: `El usuario ha sido creado correctamente`
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

 


// Controlador para iniciar sesión de usuario
export const loginUsuario = async (req, res) => {
  const { ndocumento, password } = req.body;
 
  try {
    // Buscar al usuario por su username en la base de datos
    const usuario = await Usuario.findOne({ where: { ndocumento } });

    // Si no se encuentra el usuario, devolver un error
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese número de documento",
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        ok: false,
        msg: "El usuario está inactivo, por favor contacte al administrador",
      });
    }

    // Verificar si la contraseña es correcta usando bcrypt
    const validPassword = bcrypt.compareSync(password, usuario.password);

    // Si la contraseña no es válida, devolver un error
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }
    
 
    // Generar JWT (Token de acceso)
    const token = await generarJWT(
      usuario.id, 
      usuario.nombre,
      usuario.datospersonales,
      usuario.ndocumento,
      usuario.tpUser,
      usuario.distrito,
      usuario.ubigeo 
   
    );

    // Devolver la respuesta con éxito y el token JWT
    res.json({
      ok: true,
      uid: usuario.id,
      nombre: usuario.nombre,
      datoP: usuario.datospersonales,
      docm: usuario.ndocumento,
      tpuser:usuario.tpUser,
      distrito:usuario.distrito,
      ubigeo:usuario.ubigeo ,
     
      token
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};


export const revalidarToken = async (req, res) => {
  const { uid, nombre,datoP,docm,tpuser,distrito,ubigeo } = req;
 
  // Generar JWT
  const token = await generarJWT(uid, nombre,datoP,docm,tpuser,distrito,ubigeo );

  res.json({
    ok: true,
    uid,nombre,
    datoP,
    docm,
    tpuser,
    distrito,
    ubigeo,
    token,
   
    
  });
};

 
 

export const  cambiarPass = async (req,res)=>{
  const { id ,newpass} = req.body;
  try {
    let usuario = await Usuario.findOne({ where: { id } });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No es posible, cambiar de contraseña",
      });
    }
 
    // Generar nueva contraseña aleatoria
    const nuevaPassword = newpass;
    
    // Encriptar la nueva contraseña
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(nuevaPassword, salt);
    
    // Actualizar contraseña del usuario
    usuario.password = hashedPassword;
    await usuario.save();


    res.status(201).json({
      ok: true,
      
      msg: `Hola ${usuario.nombre} , tu contraseña ha sido restablecida`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
}

export const changeStatusUser = async (req, res) => {
  const { id } = req.params;
   
  try {
    // Verificar si la usuario existe y está activa
    let usuario = await Usuario.findOne({
      where: {
        id
      }
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "La usuario no existe"
      });
    }

    // Actualizar el estado activo si se proporciona en el cuerpo de la solicitud
    if (req.body.activo !== undefined) {
      usuario.activo = req.body.activo; // Actualizar estado activo
    }

  

    // Actualizar campos de auditoría
     
    usuario.updatedAt = new Date();

    // Guardar los cambios en la base de datos
    await usuario.save();

    res.status(200).json({
      ok: true,
      msg: "Edición correcta",
      usuario // Opcional: Devolver la usuario actualizada como respuesta
    });
  } catch (error) {
    console.error("Error al editar la usuario:", error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador"
    });
  }
};
