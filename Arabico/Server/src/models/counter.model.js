// This model is used to keep track of the order number for each order. It is used to generate a unique order number for each order.

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    sequence: {
        type: Number,
        default: 1000
    }
});
counterSchema.statics.getNextSequence = async function (counterName) {
    const counter = await this.findByIdAndUpdate(
        counterName,
        { $inc: { sequence: 1 } },
        { new: true, upsert: true }
    );
    return counter.sequence;
}

const counterModel = mongoose.model('Counter', counterSchema);

module.exports = counterModel;