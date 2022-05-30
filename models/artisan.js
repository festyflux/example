const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artisanSchema = new Schema({
    firstName: {
        type: String,
    },
    LastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
    },
    State: {
        type: String,
    },
    city: {
        type: String,
    },
    businessName: {
        type: String,
    },
    cacNumber: {
        type: String,
    },
    description: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
}, { timestamps: true });

const Artisan = mongoose.model('Artisan', artisanSchema);

module.exports = Artisan;