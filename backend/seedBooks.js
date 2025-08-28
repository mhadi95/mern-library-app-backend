const mongoose = require('mongoose');
const Book = require('./models/Book');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://hadimuhammad140:POcfffPL2NT0mRQv@mern-library-testing-cl.zg660up.mongodb.net/?retryWrites=true&w=majority&appName=mern-library-testing-cluster';

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    genre: 'Fiction',
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    publishedYear: 1925,
    totalCopies: 3,
    availableCopies: 3,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310789',
    genre: 'Fiction',
    description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
    publishedYear: 1960,
    totalCopies: 2,
    availableCopies: 2,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg'
  },
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0451524935',
    genre: 'Science Fiction',
    description: 'A dystopian novel about totalitarianism and surveillance society.',
    publishedYear: 1949,
    totalCopies: 4,
    availableCopies: 4,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532714506i/40961427.jpg'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0141439518',
    genre: 'Romance',
    description: 'The story of Elizabeth Bennet and Mr. Darcy in 19th century England.',
    publishedYear: 1813,
    totalCopies: 2,
    availableCopies: 2,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0547928241',
    genre: 'Fantasy',
    description: 'The adventure of Bilbo Baggins, a hobbit who embarks on a quest with thirteen dwarves.',
    publishedYear: 1937,
    totalCopies: 3,
    availableCopies: 3,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0316769488',
    genre: 'Fiction',
    description: 'The story of Holden Caulfield, a teenager who wanders around New York City.',
    publishedYear: 1951,
    totalCopies: 2,
    availableCopies: 2,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg'
  },
  {
    title: 'Lord of the Flies',
    author: 'William Golding',
    isbn: '978-0399501487',
    genre: 'Fiction',
    description: 'A group of British boys stranded on an uninhabited island and their attempt to govern themselves.',
    publishedYear: 1954,
    totalCopies: 2,
    availableCopies: 2,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327869409i/7624.jpg'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    isbn: '978-0451526342',
    genre: 'Fiction',
    description: 'An allegorical novella about a group of farm animals who rebel against their human farmer.',
    publishedYear: 1945,
    totalCopies: 3,
    availableCopies: 3,
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327942887i/170448.jpg'
  }
];

async function seedBooks() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert sample books
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`Successfully inserted ${insertedBooks.length} books`);

    console.log('Sample books added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
}

seedBooks();
