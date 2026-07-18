const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        enum: ['cashier','manager', 'admin', 'waiter'],
        default: 'cashier'
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
    type: String,
    enum: ["admin", "manager", "cashier", "kitchen"],
    default: "cashier"
}
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;