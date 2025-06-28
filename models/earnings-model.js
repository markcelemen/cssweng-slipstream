const mongoose = require('mongoose');

const earningsSchema = new mongoose.Schema({
    basicSalary: {
        type: Number,
        default: 0,
        required: true
    },
    COLA: {
        type: Number,
        default: 0, // might change to a computation
        // required: true -- will consult if this is required
    },
    // no total earnings field
});

module.exports = mongoose.model('Earnings', earningsSchema);