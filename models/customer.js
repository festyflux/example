const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
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

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;