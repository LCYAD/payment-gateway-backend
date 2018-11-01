const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
    uuid: {
        type: String,
        unique: true
    },
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

TransactionSchema.index({ uuid: 1 });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;

module.exports.record = async (newTransaction) => {
    return newTransaction.save();
};

module.exports.getRecord = (uuid) => {
    const query = { uuid };
    return Transaction.findOne(query).exec();
};

module.exports.updateRecord = (uuid, payload) => {
    const query = { uuid };
    return Transaction.update(query, payload).exec();
};
