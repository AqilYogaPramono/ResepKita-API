const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const userModel = db.define(`user`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    username: {
        type: DataTypes.STRING,
        unique: true
    }, 
    email: {
        type: DataTypes.STRING,
        unique: true
    }, 
    password: DataTypes.STRING
    
}, {
    timestamps: false
})

module.exports = userModel