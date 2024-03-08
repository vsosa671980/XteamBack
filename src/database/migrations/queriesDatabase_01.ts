import { connectionDB } from "../connection";

async function createTablesDb() {

    try {
        // Establecer la conexión
        const conn = await connectionDB.connect();

        if (conn) {
            // Tabla de Usuarios
            const createTableUser = `
                CREATE TABLE IF NOT EXISTS Users (
                    idUser INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    surname VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    age INT,
                    rol VARCHAR(255) NOT NULL DEFAULT 'user',
                    status VARCHAR(85),
                    category VARCHAR(255),
                    img VARCHAR(255),
                    phone VARCHAR(255),
                    password VARCHAR(255) NOT NULL,
                    created DATETIME,
                    updated DATETIME
                );
            `;
            await conn.query(createTableUser);
            console.log("Tabla de Usuarios creada");

            // Payments Table
            const createPayment = `
                CREATE TABLE IF NOT EXISTS payments (
                    idPay INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    idUser INT,
                    FOREIGN KEY (idUser) REFERENCES Users(idUser)
                );
            `;
            await conn.query(createPayment);
            console.log("Tabla de Pagos creada");

            // Training Table
            const createTraining = `create table if not exists trainings (idTraining int primary key auto_increment not null,type varchar(255)
            not null , date date,location varchar(255),description varchar(255),img varchar(255));`

            await conn.query(createTraining);
            console.log("Tabla de Entrenamientos creada")

            //Training-Users Table

            const trainingUsers = `create table  if not exists trainingUser(idUser int,idTraining int,primary key(idUser,idTraining),foreign key(idUSer) references Users(idUser),foreign key(idTraining) references trainings(idTraining));
            `
            await conn.query(trainingUsers);
            console.log("Table trainingUser created");

             //Invoices Table 

            const invoice = `create table  if not exists invoice(idInvoice int primary key auto_increment not null,number varchar(255),date date not null,baseCost float not null,iva float default 21,idUser int,foreign key(idUser) references
            Users(idUser));`

            await conn.query(invoice);
            
            console.log("Table invoice created")

            //Competitions table

            const competitions= `create table  if not exists competitions(idCompetition int primary key auto_increment not null,type varchar(255),date date,img varchar(255),location varchar(255),description varchar(255));`

            await conn.query(competitions);
            
            console.log("Table competitions created");

            //UserCompetition Table

            const userCompetition= `create table  if not exists competitonUser(idUser int,idCompetition int,primary key(idUser,idCompetition),foreign key(idUser) references Users(iduser),
            foreign key(idCompetition) references competitions(idCompetition));`

            await conn.query(userCompetition);
            console.log("Table userCompetition created");

        }

       
        // Cerrar la conexión
        if(conn){
            await conn.end();
        }
        
    } catch (error) {
        console.log(error);
    }
}

createTablesDb();

export { createTablesDb };
