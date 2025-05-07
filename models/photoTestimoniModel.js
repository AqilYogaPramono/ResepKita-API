const { DataTypes } = require(`sequelize`)
const { db } = require(`../config/database`)

const photoTestimoniModel = db.define(`photo_testimoni`,{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    testimoni_id: DataTypes.INTEGER,
    photo_testimoni: DataTypes.STRING
    
}, {
    timestamps: false
})

module.exports = photoTestimoniModel