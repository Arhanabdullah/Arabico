const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true,
        min: [1, 'Table number must be at least 1'],
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved'],
        default: 'available'
    },
    capacity: {
        type: Number,
        required: true,
        min: [1, 'Table capacity must be at least 1'],
    }
}, { timestamps: true })

const tableModel = mongoose.model('Table', tableSchema)

module.exports = tableModel
