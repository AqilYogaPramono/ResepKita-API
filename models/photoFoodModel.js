const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const photoFoodModel = db.define(`photo_food`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    recipe_id: DataTypes.INTEGER,
    photo_food: DataTypes.STRING
    
}, {
    timestamps: false
})

module.exports = photoFoodModel