const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    sub_category: String,
    case_collection: String,
    design: String,
    device_model: String,
    for_whom: String,
    overview: JSON,
    details: JSON,
    images: JSON,
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', ProductSchema);