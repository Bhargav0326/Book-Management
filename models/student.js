// models/student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    regNo: { type: Number, unique: true }, // Unique registration number for each student
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] // Array of books borrowed by the student
});

module.exports = mongoose.model('Student', studentSchema);
