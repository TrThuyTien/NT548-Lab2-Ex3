const UserFavoriteRecipesModel = require('../models/user_favorite_recipes_model');
const mongoose = require("mongoose");

class UserFavoriteRecipesService {
    static async createFavoriteRecipe (data) {
        try {
            const {user_id, recipe_id} = data;

            let userFavorites = await UserFavoriteRecipesModel.findOne({ user_id });

            if (!userFavorites) {
                // Nếu chưa có, tạo mới với danh sách chứa một công thức
                userFavorites = new UserFavoriteRecipesModel({
                    user_id,
                    favorite_recipes: [recipe_id]
                });
            }
            else {
                userFavorites.favorite_recipes.push(recipe_id);
            }
            return await userFavorites.save();
        }
        catch (error) {
            throw error;
        }
    }
    // Kiem tra xem mon an do da duoc thich hay chua
    static async favoriteRecipeExisted(userId, recipeId) {
        try {
            const userFavorites = await UserFavoriteRecipesModel.findOne({ user_id: userId });

            if (!userFavorites) return false;

            // Kiểm tra xem recipeId có nằm trong danh sách yêu thích hay không
            return userFavorites.favorite_recipes.includes(recipeId);
        } catch (error) {
            throw new Error("Lỗi khi kiểm tra món ăn yêu thích: " + error.message);
        }
    }

    // Lay cac recipe_id boi user_id
    static async getRecipeIdsByUserId(userId) {
        try {
            const recipes = await UserFavoriteRecipesModel.findOne({ user_id: userId }).lean(); // Dùng `findOne()` thay vì `find()`
            
            if (!recipes || recipes.favorite_recipes.length === 0) {
                return [];
            }

            return recipes.favorite_recipes;
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách công thức yêu thích: " + error.message);
        }
    }

    // Xoa mon an yeu thich dua tren recipe_id va user_id
    static async deleteFavoriteRecipes(userId, recipeId) {
        try {
            const updatedUserFavorites = await UserFavoriteRecipesModel.findOneAndUpdate(
                { user_id: userId },
                { $pull: { favorite_recipes: recipeId } }, // Xóa recipe khỏi danh sách
                { new: true } // Trả về bản ghi đã cập nhật
            );

            if (updatedUserFavorites) return true;
            return false;
        } catch (error) {
            throw new Error("Lỗi khi xóa món ăn yêu thích: " + error.message);
        }
    }
}

module.exports = UserFavoriteRecipesService;