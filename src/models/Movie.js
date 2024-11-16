const mongoose = require('mongoose');

// Define schema for Movie
const movieSchema = new mongoose.Schema({
    title: String,
    year: String,
    poster: String
});

// Create Movie model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; // Export the model for reuse
