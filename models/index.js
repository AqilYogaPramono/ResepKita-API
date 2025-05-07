const adminModel = require('./adminModel')
const favoriteModel = require('./favoriteModel')
const foodMaterialModel = require('./foodMaterialModel')
const howToMakeModel = require('./howToMakeModel')
const photoFoodModel = require('./photoFoodModel')
const photoHowToMakeModel = require('./photoHowToMakeModel')
const photoTestimoniModel = require('./photoTestimoniModel')
const recipeModel = require('./recipeModel')
const testimoniModel = require('./testimoniModel')
const userModel = require('./userModel')

testimoniModel.hasMany(photoTestimoniModel, {foreignKey: `testimoni_id`, onDelete: `CASCADE`, hooks: true})
photoTestimoniModel.belongsTo(testimoniModel, {foreignKey: `testimoni_id`, onDelete: `CASCADE`, hooks: true})

howToMakeModel.hasMany(photoHowToMakeModel, {foreignKey: `how_to_make_id`, onDelete: `CASCADE`, hooks: true})
photoHowToMakeModel.belongsTo(howToMakeModel, {foreignKey: `how_to_make_id`, onDelete: `CASCADE`, hooks: true})

recipeModel.hasMany(photoFoodModel,{ foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})
photoFoodModel.belongsTo(recipeModel, {foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true })

userModel.hasMany(recipeModel, { foreignKey: `user_id`, onDelete: `CASCADE`, hooks: true})
recipeModel.belongsTo(userModel, { foreignKey: `user_id`, onDelete: `CASCADE`, hooks: true})

adminModel.hasMany(recipeModel, {foreignKey: `admin_id`, onDelete: `CASCADE`, hooks: true})
recipeModel.belongsTo(adminModel, {foreignKey: `admin_id`, onDelete: `CASCADE`, hooks: true})

userModel.hasMany(testimoniModel, { foreignKey: `user_id`, onDelete: `CASCADE`, hooks: true})
testimoniModel.belongsTo(userModel, { foreignKey: `user_id`, onDelete: `CASCADE`, hooks: true})

userModel.hasMany(favoriteModel, { foreignKey: `user_id`, onDelete: `CASCADE`, hooks: true})
favoriteModel.belongsTo(userModel, {foreignKey: `user_id`, onDelete: `CASCADE`, hooks: true})

recipeModel.hasMany(testimoniModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})
testimoniModel.belongsTo(recipeModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})

recipeModel.hasMany(favoriteModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})
favoriteModel.belongsTo(recipeModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})

recipeModel.hasMany(foodMaterialModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})
foodMaterialModel.belongsTo(recipeModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})

recipeModel.hasMany(howToMakeModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})
howToMakeModel.belongsTo(recipeModel, { foreignKey: `recipe_id`, onDelete: `CASCADE`, hooks: true})

module.exports = { adminModel, favoriteModel, foodMaterialModel, howToMakeModel, photoFoodModel, photoHowToMakeModel, photoTestimoniModel, recipeModel, testimoniModel, userModel }