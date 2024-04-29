// models/book.js
// const mongoose = require('mongoose');

// const bookSchema = new mongoose.Schema({
//     title: String,
//     author: String,
//     genre: String,
//     available: Boolean,
//     issuedTo: String,
//     issuedDate: Date,
//     returnDate: Date,
    
// });

// module.exports = mongoose.model('Book', bookSchema);

// models/book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    genre: String,
    available: { type: Boolean, default: true }, // Default to true, indicating book is available
    borrower: { type: mongoose.Schema.Types.Number, ref: 'Student', default: null }, // Reference to the borrowing student
    issuedDate: { type: Date, default: null },
    returnDate: { type: Date, default: null }
});

module.exports = mongoose.model('Book', bookSchema);
