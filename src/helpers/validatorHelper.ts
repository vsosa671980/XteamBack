import { body } from 'express-validator';
import { UserDao } from "../repositories/UserDao";
import { Request,Response } from 'express';

const dao = new UserDao();

const registerUserValidationRules = () => {
  return [
    body('name')
      .notEmpty().withMessage('El nombre es requerido')
      .custom(value => {
        if (!isNaN(value)) {
          throw new Error('El nombre no puede ser numérico');
        }
        return true;
      }),
    body('email')
      .notEmpty().withMessage('El correo electrónico es requerido')
      .isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('age')
    .notEmpty().withMessage('La edad es requerida')
    .isString().withMessage('La edad debe ser un string')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('El formato de la edad debe ser AAAA-MM-DD'),
    // Agrega más reglas de validación según sea necesario para otros campos
  ];
};


/**
 * Middleware for checking if email exists
 * @param req 
 * @param resp 
 * @param next 
 * @returns 
 */
const checkIfEmailExists = async (req: Request, resp: Response,next:any) => {
  try {
    const correo = req.body.email;
    const emailRequest = { email: correo };
    
    // Busca si el correo electrónico ya está registrado
    let user = await dao.filterUser(emailRequest);
    
    if (user) {
      // Si el correo electrónico está registrado, devuelve un error
      return resp.status(400).json({
        status:"error",
        message: "This email is already registered",
      });
    } else {
      // Si el correo electrónico no está registrado, devuelve éxito
      return next();
    }
  } catch (error) {
    // Maneja cualquier error que ocurra durante la búsqueda del correo electrónico
    console.error("Error checking email:", error);
    return resp.status(500).json({ error: "Internal server error" });
  }
}

export { registerUserValidationRules, checkIfEmailExists };

