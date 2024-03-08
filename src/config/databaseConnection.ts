import { Sequelize } from 'sequelize';

export class ConnectionDB {
  constructor() {}

  /**
   * Connection to database method
   */
    connectionDB() {
    const sequelize = new Sequelize('xteamBack', 'root', '123456', {
      host: 'localhost',
      dialect: 'mysql'
    });

    try {
      sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

     //this.syncDB(sequelize);
    return sequelize;
  }

 // async syncDB(connectionInstance: Sequelize) {
  //  try {
     // await connectionInstance.sync({ alter: true }); // Use alter: true to make changes to existing tables
    //  console.log("Tables synchronized successfully with the models.");
  //  } catch (error) {
  //    console.error("Error synchronizing tables with models:", error);
  //  }
 // }
}