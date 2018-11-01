const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    status: {
        type: String
    },
    name: {
        type: String
    },
    phone_num: {
        type: String
    },
    currency: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;

module.exports.record = (newTransaction) => {
    return newTransaction.save();
};

module.exports.getRecord = (id) => {
    return Transaction.findById(id).exec();
};

module.exports.updateRecord = (id, payload) => {
    return Transaction.findByIdAndUpdate(id, payload, { new: true }).exec();
};
