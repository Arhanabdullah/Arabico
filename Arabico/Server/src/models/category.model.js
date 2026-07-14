const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true
    },
    isActive:{
        type: Boolean,
        default: true
    }
})

const categoryModel = mongoose.model('Category', categorySchema);
module.exports = categoryModel;