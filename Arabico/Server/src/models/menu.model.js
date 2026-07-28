const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, 
        index: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    image: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const menuModel = mongoose.model('Menu', menuSchema);

module.exports = menuModel;