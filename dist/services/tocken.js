"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tockenGenerator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
    * Clase for generate object token
  
    */
class tockenGenerator {
    /**
     * Crea una instancia de TokenGenerator.
     * @param {object} payload - La información que se incluirá en el token.
     * @param {string} secretKey - La clave secreta para firmar el token.
     */
    constructor() {
        const secret = process.env.TOCKEN_SECRET;
        if (!secret) {
            throw new Error('TOCKEN_SECRET not found in environment variables.');
        }
        this.secretKey = secret;
        this.checkToken = this.checkToken.bind(this);
    }
    /**
    * Genera un token JWT utilizando el payload y la clave secreta proporcionados.
    * @returns {string} El token JWT generado.
    * .
    * @private
    */
    setToken(payload) {
        const token = jsonwebtoken_1.default.sign(payload, this.secretKey);
        return token;
    }
    /**
     * Create middleware for check tokens
     * @param req
     * @param res
     * @param next
     * @returns
     */
    checkToken(req, res, next) {
        // Obtener el token
        let tokenReceived;
        if (req.headers.authorization) {
            tokenReceived = req.headers.authorization.split(" ")[1];
        }
        else {
            return res.status(401).json({ mensaje: 'Token no proporcionado' });
        }
        // Revisar el token
        try {
            // Verificar el token
            let result;
            if (tokenReceived) {
                //const decoded = jwt.verify(tokenReceived, this.secretKey) as DecodedToken;
                let decoded = jsonwebtoken_1.default.verify(tokenReceived, this.secretKey);
                if (typeof decoded !== "string") {
                    result = decoded;
                }
                if (result !== undefined) {
                    console.log(result.rol);
                }
                // Agregar el payload decodificado al objeto de solicitud para su uso posterior
                // req.usuario = decoded;
                // Continuar con el siguiente middleware
                next();
            }
            else {
                return res.status(401).json({ mensaje: 'Token no proporcionado' });
            }
        }
        catch (error) {
            console.log('Error al verificar el token:', error);
            if (tokenReceived) {
                return res.status(401).json({ mensaje: 'Token inválido', token: tokenReceived, error: error });
            }
            else {
                return res.status(401).json({ mensaje: 'Token no proporcionado', error: error });
            }
        }
    }
}
exports.tockenGenerator = tockenGenerator;
