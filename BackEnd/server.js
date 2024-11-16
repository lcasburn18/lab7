const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Enable CORS
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Parse JSON and URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://admin:<admin>@cluster0.q66of.mongodb.net/moviesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

// Define Movie Schema and Model
const movieSchema = new mongoose.Schema({
    title: String,
    year: String,
    poster: String
});
const Movie = mongoose.model('Movie', movieSchema);

// API Endpoints

// GET: Fetch all movies from the database
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find(); // Fetch all movies
        res.status(200).json({ movies });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving movies", error });
    }
});

// POST: Add a new movie to the database
app.post('/api/movies', async (req, res) => {
    try {
        const { title, year, poster } = req.body;

        // Create a new movie instance
        const newMovie = new Movie({ title, year, poster });
        await newMovie.save(); // Save to MongoDB

        res.status(201).json({ message: "Movie created successfully", movie: newMovie });
    } catch (error) {
        res.status(400).json({ message: "Error adding movie", error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
