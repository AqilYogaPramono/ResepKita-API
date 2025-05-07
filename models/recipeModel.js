const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const recipeModel = db.define(`recipe`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER,
    recipe_title: DataTypes.STRING,
    recipe_description: DataTypes.TEXT,
    food_portion: DataTypes.INTEGER,
    cooking_time: DataTypes.INTEGER,
    status: DataTypes.ENUM(`process`, `approver`, `reject `),
    admin_comment: DataTypes.TEXT
}, {
    timestamps: false
})

module.exports = recipeModel