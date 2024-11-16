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

// Static Movie Data (mocked data)
const staticMovies = [
    {
        "Title": "Avengers: Infinity War (server)",
        "Year": "2018",
        "imdbID": "tt4154756",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg"
    },
    {
        "Title": "Captain America: Civil War (server)",
        "Year": "2016",
        "imdbID": "tt3498820",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMjQ0MTgyNjAxMV5BMl5BanBnXkFtZTgwNjUzMDkyODE@._V1_SX300.jpg"
    },
    {
        "Title": "World War Z (server)",
        "Year": "2013",
        "imdbID": "tt0816711",
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BNDQ4YzFmNzktMmM5ZC00MDZjLTk1OTktNDE2ODE4YjM2MjJjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg"
    }
];

// Static Movie API endpoint
app.get('/api/movies', (req, res) => {
    res.status(200).json({ movies: staticMovies });
});

// MongoDB API Endpoints

// GET: Fetch all movies from the database
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find(); // Fetch all movies
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving movies from MongoDB", error });
    }
});

// GET: Fetch a movie by ID from the database
app.get('/api/movie/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id); // Find movie by ID
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving movie", error });
    }
});

// POST: Add a new movie to the database
app.post('/api/movies', async (req, res) => {
    try {
        const { title, year, poster } = req.body;

        // Create and save a new movie
        const newMovie = new Movie({ title, year, poster });
        await newMovie.save();

        res.status(201).json({ message: "Movie created successfully", movie: newMovie });
    } catch (error) {
        res.status(400).json({ message: "Error adding movie", error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

