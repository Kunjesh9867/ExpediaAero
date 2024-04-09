const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var adminSchemaDefinition = {
    username: String,
    email: String,
    password: String,
}

var adminSchema = new mongoose.Schema(adminSchemaDefinition);
adminSchema.plugin(passportLocalMongoose); // Add this line

module.exports = new mongoose.model('Admin', adminSchema);
