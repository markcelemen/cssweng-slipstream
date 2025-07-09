const mongoose = require('mongoose');

const deductionsSchema = new mongoose.Schema({
    SSS: {
        type: Number,
        default: 0
    },
    pagibig: {
        type: Number,
        default: 0
    },
    philhealth: {
        type: Number,
        default: 0
    },
    withholdingTax: {
        type: Number,
        default: 0
    },
    sssSalaryLoan: {
        type: Number,
        default: 0
    },
    calamityLoan: {
        type: Number,
        default: 0
    },
    cashAdvance: {
        type: Number,
        default: 0
    },
    absence: {
        type: Number,
        default: 0
    },
    otherDeduct: {
        value: {
            type: Number,
            default: 0
        },
        isAdded: {
            type: Boolean,
            default: false
        }
    },
    otherRecur: {
        value: {
            type: Number,
            default: 0
        },
        isAdded: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('Deductions', deductionsSchema);