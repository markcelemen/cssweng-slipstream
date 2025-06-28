const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeID: {
        type: Number,
        default: 80000000,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: "https://i.pinimg.com/736x/60/42/74/604274ee52daacfce753511d50f0c658.jpg"
    },
    department: {
        type: String,
        required: true
    },
    coordinator: {
        type: String, // might change to employee reference
        required: true
    },
    position: {
        type: String,
        required: true
    },
    totalSalary: {
        type: Number, // will change this to basic salary + earnings soon
        default: 0,
        required: true
    },
    basicSalary: {
        type: Number, // will change this to earnings reference
        default: 0,
        required: true
    },
    contactInfo: {
        type: String,
        default: '09123456789',
        required: true
    },
    email: {
        type: String,
        default: 'employee@gmail.com',
        required: true
    }
});

module.exports = mongoose.model('Employee', employeeSchema);