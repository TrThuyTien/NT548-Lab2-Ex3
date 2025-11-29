const mongoose = require("mongoose");

const db = require("../config/database");

const {Schema} = mongoose;

const user_favorite_recipesSchema = new Schema ({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    favorite_recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipes",
        required: true
    }]
});

user_favorite_recipesSchema.index({user_id: 1, recipe_id: 1}, {unique: true});
const UserFavoriteRecipesModel = db.model('user_favorite_recipes', user_favorite_recipesSchema);

module.exports = UserFavoriteRecipesModel;