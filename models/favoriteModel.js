const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const favoriteModel = db.define(`favorite`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    user_id: DataTypes.INTEGER,
    recipe_id: DataTypes.INTEGER
}, {
    timestamps: false
})

module.exports = favoriteModel