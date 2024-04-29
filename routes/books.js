// routes/books.js
const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Student = require('../models/student');
// const 

// API endpoint to send email when a student borrows a book
router.post('/send-email/borrow', async (req, res) => {
    const { studentEmail, bookTitle } = req.body;

    const url = 'https://mail-sender-api1.p.rapidapi.com/';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'f090e24ffemsh19f66c47abcec11p1a52f2jsn3af610b9aec6',
        'X-RapidAPI-Host': 'mail-sender-api1.p.rapidapi.com'
      },
      body: {
        sendto: 'bhargavnalla01@gmail.com',
        name: 'Bhargav',
        replyTo: 'bhargavnalla01@gmail.com',
        ishtml: 'false',
        title: 'Book Borrowed',
        body: `You have borrowed the book "${bookTitle}".`
      }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }


//     const url = 'https://mail-sender-api1.p.rapidapi.com/';
//     const options = {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': 'f090e24ffemsh19f66c47abcec11p1a52f2jsn3af610b9aec6',
//             'X-RapidAPI-Host': 'mail-sender-api1.p.rapidapi.com'
//         },
//         body: JSON.stringify({
//             sendto: studentEmail,
//             title: 'Book Borrowed',
//             body: `You have borrowed the book "${bookTitle}".`
//         })
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         console.log(result);
//         res.status(200).send('Email sent successfully');
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).send('Failed to send email');
//     }
//
 });


// API endpoint to send email when a student returns a book
router.post('/send-email/return', async (req, res) => {
    const { studentEmail, bookTitle } = req.body;

    const url = 'https://mail-sender-api1.p.rapidapi.com/';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'f090e24ffemsh19f66c47abcec11p1a52f2jsn3af610b9aec6',
            'X-RapidAPI-Host': 'mail-sender-api1.p.rapidapi.com'
        },
        body: JSON.stringify({
            sendto: studentEmail,
            title: 'Book Returned',
            body: `You have returned the book "${bookTitle}".`
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});
// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/students/', async (req, res) => {
    try {
        const student = await Student.find();
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get one book
router.get('/:id', getBook, (req, res) => {
    res.json(res.book);
});

// Create a book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        available: req.body.available || true
    });
    console.log("This is called"+book);
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add a new student
router.post('/students', async (req, res) => {
    
    const student_1=new Student({
        name:req.body.name,
        email:req.body.email,
        regNo:req.body.regNo
    });
   
    try {
        const newStudent = await student_1.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Update a book
router.put('/:id', getBook, async (req, res) => {
    if (req.body.title != null) {
        res.book.title = req.body.title;
    }
    if (req.body.author != null) {
        res.book.author = req.body.author;
    }
    if (req.body.genre != null) {
        res.book.genre = req.body.genre;
    }
    if (req.body.available != null) {
        res.book.available = req.body.available;
    }

    try {
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
router.delete('/:id', getBook, async (req, res) => {
    
    
    try {
        const book = res.book;
        if(book.available){
        await res.book.deleteOne();
        res.json({ message: 'Book deleted' });
        }
        else res.status(400).json({message:"This book is not returned"});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getBook(req, res, next) {
    try {
        book = await Book.findById(req.params.id);
        if (book == null) {
            return res.status(404).json({ message: 'Book not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.book = book;
    next();
}
// routes/books.js

// Assign a book to a student
// routes/books.js

// Assign a book to a student based on registration number
router.post('/:id/borrow', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
           
            return res.status(404).json({ message: 'Book not found' });
        }
        if (!book.available) {
            console.log("book not avalible");
            return res.status(400).json({ message: 'Book not available for borrowing' });
        }
        const regNo = parseInt(req.body.regNo); // Extract registration number from request body
        const student = await Student.findOne({ regNo }); // Find student by registration number
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        book.available = false;
        book.borrower = student.regNo;
        book.issuedDate = new Date();
        await book.save();
        student.borrowedBooks.push(book._id);
        await student.save();
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update the endpoint to populate the borrowedBooks field
router.get('/students/borrow', async (req, res) => {
    try {
        const students = await Student.find().populate('borrowedBooks');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Return a book
router.post('/:id/return', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book.available) {
            return res.status(400).json({ message: 'Book is already available' });
        }
        const studentId = req.body.regNo;
        console.log(studentId);
        const student = await Student.findOne({ regNo: studentId });

        console.log(student);
       
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        console.log(book._id);
        console.log(student.name);
         console.log(student.borrowedBooks);
         if (!student.borrowedBooks.some(b => b.toString() === book._id.toString())) {
            return res.status(400).json({ message: 'Student has not borrowed this book' });
        }
        book.available = true;
        book.borrower = null;
        book.issuedDate = null;
        book.returnDate = new Date();
        await book.save();
        student.borrowedBooks = student.borrowedBooks.filter(b => b.toString() !== book._id.toString());
        await student.save();
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
