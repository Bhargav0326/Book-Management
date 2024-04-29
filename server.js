// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/books', bookRoutes);

// Serve static files
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect("mongodb+srv://bhargav1:bhargav@cluster0.trk3grz.mongodb.net/books1")
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
