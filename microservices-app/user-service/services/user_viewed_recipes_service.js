const UserViewedRecipesModel = require('../models/user_viewed_recipes_model');

class UserViewedRecipesService {
    static async createViewedRecipe(data) {
        try {
            const {user_id, recipe_id} = data;

            let userViewed = await UserViewedRecipesModel.findOne({user_id});

            if (!userViewed) {
                userViewed = new UserViewedRecipesModel({
                    user_id,
                    viewed_recipes: [{recipe_id, view_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })}]
                });
            }
            else {
                userViewed.viewed_recipes.push({recipe_id, view_at: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })});
            }

            return await userViewed.save();
        }
        catch (error) {
            throw error;
        }
    }

    // Kiem tra da ton tai mon an da xem hay chua
    static async viewedRecipeExisted(userId, recipeId) {
        try {
            const userViewed = await UserViewedRecipesModel.findOne({user_id: userId});

            if (!userViewed) return false;

            const recipeExisted = await userViewed.viewed_recipes
                                        .some(recipe => recipe.recipe_id.equals(recipeId));

            if (recipeExisted) return true;
            return false;
        }
        catch (error) {
            throw error;
        }
    }

    // Lay cac recipe_id boi user_id
    static async getViewedRecipesByUserId (userId) {
        try {
            const userViewed = await UserViewedRecipesModel.findOne({user_id: userId});

            if (userViewed) return userViewed.viewed_recipes.sort((a, b) => b.view_at - a.view_at);
            return [];
        }
        catch (error) {
            throw error;
        }
    }

    static async updateNewTimeView (userId, recipeId) {
        try {
            const update = await UserViewedRecipesModel.updateOne(
                { user_id: userId, "viewed_recipes.recipe_id": recipeId },
                { $set: { "viewed_recipes.$.view_at": new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }) } }
            );
            console.log(update);
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = UserViewedRecipesService;