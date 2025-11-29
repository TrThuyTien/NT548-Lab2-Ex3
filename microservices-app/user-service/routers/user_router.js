const router = require("express").Router();
const UserController = require("../controllers/user_controller");
const upload = require("../middleware/multer");
const authenticateToken = require("../middleware/auth");
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Các API liên quan tới User
 */

/**
 * @swagger
 * /user/registration:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: OTP đã được gửi đến email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: Please verify OTP sent to your email.
 *       400:
 *         description: Lỗi đăng ký (Email hoặc username đã tồn tại)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email is already registered.
 *       500:
 *         description: Lỗi phía server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.post('/registration', UserController.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 _id:
 *                   type: string
 *                   example: 60e8d0f5f3c0c81234567890
 *                 email:
 *                   type: string
 *                   example: johndoe@example.com
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 accessToken:
 *                   type: string
 *                   description: Access token dùng để xác thực
 *                 refreshToken:
 *                   type: string
 *                   description: Token để lấy access token mới khi hết hạn
 *                 accessTokenExpire:
 *                   type: string
 *                   example: 15m  
 *                 avatar_url:
 *                   type: string
 *                   format: uri
 *                   example: "https://res.cloudinary.com/demo/image/upload/v1612345678/avatar.jpg"   
 *       400:
 *         description: Sai thông tin đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password incorrect
 *       404:
 *         description: Không tìm thấy User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Not Found
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /user/updateAvatar:
 *   post:
 *     summary: Cập nhật ảnh đại diện người dùng
 *     description: Upload ảnh đại diện mới cho người dùng đã đăng nhập. Yêu cầu xác thực bằng access token và gửi ảnh dưới dạng multipart/form-data.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện mới (file hình ảnh)
 *     responses:
 *       201:
 *         description: Cập nhật ảnh đại diện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar_url:
 *                   type: string
 *                   format: uri
 *                   example: "https://res.cloudinary.com/demo/image/upload/v1612345678/avatar.jpg"
 *       400:
 *         description: Thiếu ảnh đại diện trong request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Image is required"
 *       404:
 *         description: Không tìm thấy người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User Not Found"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/updateAvatar', upload.single('image'), authenticateToken, UserController.updateAvatar);
/**
 * @swagger
 * /user/verifyOtp:
 *   post:
 *     summary: Xác thực mã OTP
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otpCode
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               otpCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: "OTP đúng và xử lý thành công (ví dụ: đăng ký tài khoản hoặc quên mật khẩu)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP Verified and User Registered Successfully
 *       400:
 *         description: "OTP không hợp lệ, hết hạn hoặc action không đúng"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP expired or invalid
 *       500:
 *         description: "Lỗi phía server"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.post('/verifyOtp', UserController.verifyOtp);

/**
 * @swagger
 * /user/forgotPassword:
 *   post:
 *     summary: Yêu cầu đặt lại mật khẩu (quên mật khẩu)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Đã gửi mã OTP đến email của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 success:
 *                   type: string
 *                   example: User Forgot Password. Please verify OTP sent to your email.
 *       404:
 *         description: Không tìm thấy người dùng với email cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Lỗi phía server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/forgotPassword', UserController.forgotPassword);

/**
 * @swagger
 * /user/resetPassword:
 *   post:
 *     summary: Đặt lại mật khẩu mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newSecurePassword123
 *     responses:
 *       201:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       500:
 *         description: Lỗi phía server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/resetPassword', UserController.resetPassword);

/**
 * @swagger
 * /user/refreshAccessToken:
 *   post:
 *     summary: Tạo accessToken mới
 *     description: Dùng refresh token để lấy access token mới khi access token cũ đã hết hạn.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Access token được cấp lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 accessTokenExpire:
 *                   type: string
 *                   example: 15m
 *       401:
 *         description: Thiếu refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh Token is required
 *       403:
 *         description: Refresh token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Refresh Token
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/refreshAccessToken', UserController.refreshAccessToken);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     description: Đăng xuất người dùng bằng cách xóa refresh token khỏi server và yêu cầu access token hợp lệ qua header Authorization.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token để hủy bỏ đăng nhập
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Đăng xuất thành công hoặc đã đăng xuất trước đó
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       400:
 *         description: Không có refresh token trong request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh Token is required
 *       401:
 *         description: Không có hoặc token không hợp lệ trong Authorization header
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/logout', authenticateToken, UserController.logout);

/**
 * @swagger
 * /user/addFavoriteRecipes:
 *   post:
 *     summary: Thêm món ăn yêu thích của người dùng
 *     tags:
 *       - User_Recipes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipe_id
 *             properties:
 *               recipe_id:
 *                 type: string
 *                 example: "665e2d1c7b7d5a6f1d289012"
 *     responses:
 *       200:
 *         description: Add favorite recipe successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Add favorite recipe successfully
 *       400:
 *         description: Recipe already added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Had added before
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Recipe not found or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Recipe not found
 *       500:
 *         description: Internal server error
 */
router.post('/addFavoriteRecipes', authenticateToken, UserController.addFavoriteRecipe);

/**
 * @swagger
 * /user/allFavoriteRecipes:
 *   get:
 *     summary: Lấy danh sách món ăn yêu thích của người dùng
 *     tags:
 *       - User_Recipes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the recipe
 *                     example: "6630c4d5123e4c34a8f2b9d2"
 *                   title:
 *                     type: string
 *                     description: Title of the recipe
 *                     example: "Spaghetti Bolognese"
 *                   image:
 *                     type: string
 *                     description: URL of the recipe's image
 *                     example: "https://example.com/images/spaghetti.jpg"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.get('/allFavoriteRecipes/', authenticateToken, UserController.getAllFavoriteRecipes);


/**
 * @swagger
 * /user/favoriteRecipe/{recipe_id}:
 *   delete:
 *     tags:
 *       - User_Recipes
 *     summary: Xóa món ăn yêu thích của người dùng hiện tại
 *     description: Xóa công thức yêu thích của người dùng hiện tại, xác định qua token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipe_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của công thức cần xóa khỏi danh sách yêu thích
 *     responses:
 *       200:
 *         description: Xóa thành công hoặc công thức đã bị xóa trước đó
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Removed favorite recipe successfully
 *       400:
 *         description: Công thức yêu thích đã được loại bỏ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Recipe already removed
 *       401:
 *         description: Unauthorized - Thiếu hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Không tìm thấy người dùng hoặc công thức
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Recipe not found
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.delete('/favoriteRecipe/:recipe_id', authenticateToken, UserController.deleteFavoriteRecipe);

/**
 * @swagger
 * /user/addViewedRecipes:
 *   post:
 *     summary: Thêm món ăn vừa xem của người dùng
 *     tags:
 *       - User_Recipes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipe_id
 *             properties:
 *               recipe_id:
 *                 type: string
 *                 example: "665a5aa7c2a7b3f5448be21d"
 *                 description: MongoDB ObjectId of the recipe
 *     responses:
 *       200:
 *         description: Successfully updated the view time of a recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated view time for recipe
 *       201:
 *         description: Successfully added a new viewed recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Added new viewed recipe
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User or Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/addViewedRecipes', authenticateToken, UserController.addViewedRecipe);

/**
 * @swagger
 * /user/allViewRecipes:
 *   get:
 *     summary: Lấy danh sách món ăn yêu thích của người dùng
 *     tags:
 *       - User_Recipes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of viewed recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "665a5aa7c2a7b3f5448be21d"
 *                   title:
 *                     type: string
 *                     example: "Delicious Pancakes"
 *                   image:
 *                     type: string
 *                     example: "https://yourdomain.com/images/recipe1.jpg"
 *                   view_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-05-23T14:30:00Z"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.get('/allViewRecipes/', authenticateToken, UserController.getAllViewedRecipes);

module.exports = router;