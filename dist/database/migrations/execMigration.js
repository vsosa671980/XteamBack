"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMigration = void 0;
const fs_1 = __importDefault(require("fs"));
function SetMigration(nameFile) {
    const rutaArchivo = `dist\database\migrations\${nameFile}.js`;
    if (fs_1.default.existsSync(rutaArchivo)) {
        // Importar y ejecutar el archivo
        require(rutaArchivo);
    }
    else {
        console.error(`El archivo ${rutaArchivo} no existe.`);
    }
}
exports.SetMigration = SetMigration;
const nombreScript = process.argv[2];
// Ejecutar el script correspondiente
SetMigration(nombreScript);
