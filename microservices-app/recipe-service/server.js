const express = require("express");
const body_parser = require("body-parser");
const recipeRouter = require("./routers/recipe_router");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
require("dotenv").config();


const app = express();

app.use(body_parser.json());

app.use('/api/recipe', recipeRouter);
app.use('/recipe-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

const port = process.env.PORT || 5002;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});