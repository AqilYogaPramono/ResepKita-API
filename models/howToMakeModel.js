const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const howToMakeModel = db.define(`how_to_make`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    recipe_id: DataTypes.INTEGER,
    cooking_step: DataTypes.STRING
}, {
    timestamps: false
})

module.exports = howToMakeModel