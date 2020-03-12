const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: Number,
    address: String,
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);