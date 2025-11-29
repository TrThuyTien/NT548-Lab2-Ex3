const mongoose = require("mongoose");

const db = require("../config/database");

const {Schema} = mongoose;

const factSchema = new Schema({
    quote: {
        type: String,
        require: true,
        unique: true
    }
});

const FactModel = db.model("facts", factSchema);

module.exports = FactModel;

