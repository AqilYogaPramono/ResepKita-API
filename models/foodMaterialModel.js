const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const foodMaterialModel = db.define(`food_material`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    recipe_id: DataTypes.INTEGER,
    name_food_material: DataTypes.STRING
}, {
    timestamps: false
})

module.exports = foodMaterialModel