const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
        unique: true
    },

    orderType: {
        type: String,
        enum: ['dine_in', 'takeaway', 'delivery'],
        required: true
    },

    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    },

    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: function (items) {
                return items.length > 0;
            },
            message: 'Order must contain at least one item'
        }
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        enum: [
            'pending',
            'preparing',
            'ready',
            'served',
            'completed',
            'cancelled'
        ],
        default: 'pending'
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    customerName: {
        type: String,
        trim: true
    },

    customerPhone: {
        type: String,
        trim: true
    },

    deliveryAddress: {
        type: String,
        trim: true
    }

}, { timestamps: true });

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;