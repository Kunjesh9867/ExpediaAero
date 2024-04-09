const mongoose = require("mongoose");

const cartSchemaDefinition = {
    time: {
        type: String,
        required: true,
    },
    nonstop: {
        type: String,
        required: true,
    },
    price: {
        type: BigInt,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    flight: {
        type: String,
        required: true,
    },
};

var cartSchema = new mongoose.Schema(cartSchemaDefinition);
module.exports = mongoose.model("Cart", cartSchema);
