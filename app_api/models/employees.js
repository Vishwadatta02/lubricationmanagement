const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    locationName: { type: String },
    coords: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number],
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'done', 'canceled', 'absent'],
        default: 'pending',
    },
});

visitSchema.index({ coords: '2dsphere' });

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        enum: ['site engineer', 'regional manager', 'territorial manager'],
        required: true,
    },
    visits: [visitSchema], // Subdocument array
});

mongoose.model('Employee', employeeSchema);
module.exports = employeeSchema;
