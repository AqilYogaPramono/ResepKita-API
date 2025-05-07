const {Sequelize} = require(`sequelize`)

const db = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS,{
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
})

async function connectDB() {
    try{
        await db.authenticate();
        console.log("Database Connected")
    }catch(error){
        console.log(error)
    }
}

module.exports = {db, connectDB}