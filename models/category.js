const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    image: String
}, { timestamps: true });

CategorySchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('Category', CategorySchema);