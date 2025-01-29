const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    userId: {
        type: String,
        // ref: 'User', // Assuming you have a User model
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photos: {
        type: [String], // Array of strings (URLs or file paths)
        validate: [arrayLimit, '{PATH} exceeds the limit of 10 photos'] // Custom validator to limit the number of photos
    },
    price: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        enum: ['sedan', 'suv', 'sports', 'hatchback', 'coupe', 'convertible', 'minivan', 'truck'], // Example tags
        required: true
    },
    detailDescription: {
        type: String,
        required: true
    }
});

// Custom validator function to limit the number of photos to 10
function arrayLimit(val) {
    return val.length <= 10;
}

const Car = mongoose.model('Car', CarSchema);

module.exports = Car;