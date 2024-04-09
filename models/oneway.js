const mongoose = require("mongoose");

const onewaySchemaDefinition = {
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

var onewaySchema = new mongoose.Schema(onewaySchemaDefinition);
module.exports = mongoose.model("Oneway", onewaySchema);
