const express = require('express');
const router = express.Router();
const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET all borrowings for a user
router.get('/my-borrowings', authenticateToken, async (req, res) => {
  try {
    const borrowings = await Borrowing.find({ user: req.user.userId })
      .populate('book', 'title author isbn imageUrl')
      .sort({ createdAt: -1 });
    
    res.json(borrowings);
  } catch (error) {
    console.error('Error fetching borrowings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all borrowings (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const borrowings = await Borrowing.find()
      .populate('user', 'name email')
      .populate('book', 'title author isbn')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(borrowings);
  } catch (error) {
    console.error('Error fetching all borrowings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create borrowing request
router.post('/', authenticateToken, [
  body('bookId').notEmpty().withMessage('Book ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is admin - admins cannot borrow books
    const user = await User.findById(req.user.userId);
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot borrow books. Please use a regular user account.' });
    }

    const { bookId } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    // Check if user already has a pending or active borrowing for this book
    const existingBorrowing = await Borrowing.findOne({
      user: req.user.userId,
      book: bookId,
      status: { $in: ['pending', 'approved', 'borrowed'] }
    });

    if (existingBorrowing) {
      return res.status(400).json({ message: 'You already have a borrowing request for this book' });
    }

    // Create borrowing request
    const borrowing = new Borrowing({
      user: req.user.userId,
      book: bookId,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    });

    await borrowing.save();

    // Populate book details for response
    await borrowing.populate('book', 'title author isbn imageUrl');

    res.status(201).json({
      message: 'Borrowing request created successfully',
      borrowing
    });
  } catch (error) {
    console.error('Error creating borrowing request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT approve borrowing request (admin only)
router.put('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing request not found' });
    }

    if (borrowing.status !== 'pending') {
      return res.status(400).json({ message: 'Borrowing request is not pending' });
    }

    // Check if book is still available
    const book = await Book.findById(borrowing.book);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Update borrowing status
    borrowing.status = 'approved';
    borrowing.approvedBy = req.user?.userId || borrowing.user; // For demo, use user ID if no admin
    borrowing.approvedAt = new Date();

    // Update book available copies
    book.availableCopies -= 1;

    await Promise.all([borrowing.save(), book.save()]);

    await borrowing.populate('book', 'title author isbn');
    await borrowing.populate('user', 'name email');

    res.json({
      message: 'Borrowing request approved successfully',
      borrowing
    });
  } catch (error) {
    console.error('Error approving borrowing request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT reject borrowing request (admin only)
router.put('/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing request not found' });
    }

    if (borrowing.status !== 'pending') {
      return res.status(400).json({ message: 'Borrowing request is not pending' });
    }

    borrowing.status = 'rejected';
    borrowing.notes = req.body.notes || borrowing.notes;

    await borrowing.save();

    await borrowing.populate('book', 'title author isbn');
    await borrowing.populate('user', 'name email');

    res.json({
      message: 'Borrowing request rejected successfully',
      borrowing
    });
  } catch (error) {
    console.error('Error rejecting borrowing request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT return book (admin only)
router.put('/:id/return', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }



    if (borrowing.status !== 'approved' && borrowing.status !== 'borrowed') {
      return res.status(400).json({ message: 'Book is not currently borrowed' });
    }

    // Update borrowing status
    borrowing.status = 'returned';
    borrowing.returnDate = new Date();

    // Update book available copies
    const book = await Book.findById(borrowing.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    await borrowing.save();

    await borrowing.populate('book', 'title author isbn');
    await borrowing.populate('user', 'name email');

    res.json({
      message: 'Book returned successfully',
      borrowing
    });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET borrowing by ID
router.get('/:id', async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id)
      .populate('user', 'name email')
      .populate('book', 'title author isbn imageUrl')
      .populate('approvedBy', 'name');
    
    if (!borrowing) {
      return res.status(404).json({ message: 'Borrowing record not found' });
    }

    res.json(borrowing);
  } catch (error) {
    console.error('Error fetching borrowing:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
