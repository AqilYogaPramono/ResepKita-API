const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const photoHowToMakeModel = db.define(`photo_how_to_make`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    how_to_make_id: DataTypes.INTEGER,
    photo_how_to_make: DataTypes.STRING
    
}, {
    timestamps: false
})

module.exports = photoHowToMakeModel