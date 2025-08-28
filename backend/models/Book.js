const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number,
    required: true
  },
  totalCopies: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  availableCopies: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150x200?text=Book+Cover'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', bookSchema);
