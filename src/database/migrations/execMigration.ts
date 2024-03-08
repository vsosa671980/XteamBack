import fs from 'fs';

function SetMigration(nameFile:string){

    const rutaArchivo = `dist\database\migrations\${nameFile}.js`;

    if (fs.existsSync(rutaArchivo)) {
        // Importar y ejecutar el archivo
        require(rutaArchivo);
    } else {
        console.error(`El archivo ${rutaArchivo} no existe.`);
    }
}

const nombreScript = process.argv[2];

// Ejecutar el script correspondiente
SetMigration(nombreScript);

export{SetMigration}