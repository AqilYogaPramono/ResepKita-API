const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const testimoniModel = db.define(`testimoni`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    recipe_id: DataTypes.INTEGER,
    testimoni: DataTypes.TEXT
}, {
    timestamps: false
})

module.exports = testimoniModel