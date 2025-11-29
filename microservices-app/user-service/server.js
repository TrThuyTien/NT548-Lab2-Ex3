const express = require("express");
const body_parser = require("body-parser");
const userRouter = require("./routers/user_router");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
require("dotenv").config();


const app = express();

app.use(body_parser.json());

app.use('/api/user', userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});