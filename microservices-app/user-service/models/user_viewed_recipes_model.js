const mongoose = require("mongoose");

const db = require("../config/database");

const {Schema} = mongoose;

const user_viewed_recipesSchema = new Schema ({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    viewed_recipes: [{
        recipe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipes",
        required: true
        },
        view_at: {
            type: Date,
            require: true
        }
    }]

});

const UserViewedRecipesModel = db.model('user_viewed_recipes', user_viewed_recipesSchema);

module.exports = UserViewedRecipesModel;