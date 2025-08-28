# Library Management System

A full-stack library management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows users to browse books, request borrowing, and manage returns.

## Features

### For Users:
- 📚 Browse and search books by title, author, or ISBN
- 🔍 Filter books by genre and author
- 📖 View detailed book information
- 📝 Request to borrow books
- 📋 View borrowing history and status
- 🔄 Return borrowed books
- 👤 User profile management
- 🔐 User authentication (login/register)

### For Administrators:
- 👨‍💼 Admin panel for managing books and borrowing requests
- ➕ Add new books to the library
- ❌ Delete books from the library
- ✅ Approve or reject borrowing requests
- 📊 View all borrowing activities

## Tech Stack

- **Frontend**: React.js, React Router, Axios, React Toastify
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Database**: MongoDB Atlas
- **Styling**: CSS3 with responsive design

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd library-app-crsr
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   npm run install-client
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

   **To get MongoDB Atlas connection string:**
   1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   2. Create a free account or sign in
   3. Create a new cluster
   4. Click "Connect" and choose "Connect your application"
   5. Copy the connection string and replace `<password>` with your database password
   6. Replace `<dbname>` with `library-app`

4. **Run the application**

   **Development mode (runs both frontend and backend):**
   ```bash
   npm run dev
   ```

   **Or run them separately:**
   ```bash
   # Backend only
   npm run server
   
   # Frontend only (in a new terminal)
   npm run client
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Books
- `GET /api/books` - Get all books (with search and filters)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add new book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Borrowings
- `GET /api/borrowings` - Get all borrowings (admin only)
- `GET /api/borrowings/my-borrowings` - Get user's borrowings
- `POST /api/borrowings` - Create borrowing request
- `PUT /api/borrowings/:id/approve` - Approve borrowing (admin only)
- `PUT /api/borrowings/:id/reject` - Reject borrowing (admin only)
- `PUT /api/borrowings/:id/return` - Return book

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: 'user', 'admin'),
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model
```javascript
{
  title: String,
  author: String,
  isbn: String (unique),
  genre: String,
  description: String,
  publishedYear: Number,
  totalCopies: Number,
  availableCopies: Number,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Borrowing Model
```javascript
{
  user: ObjectId (ref: User),
  book: ObjectId (ref: Book),
  status: String (enum: 'pending', 'approved', 'borrowed', 'returned', 'rejected'),
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  approvedBy: ObjectId (ref: User),
  approvedAt: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### For Regular Users:
1. Register an account or login
2. Browse books using search and filters
3. Click on a book to view details
4. Request to borrow available books
5. Check your borrowing history
6. Return books when finished

### For Administrators:
1. Login with admin credentials
2. Access the Admin Panel
3. Manage borrowing requests (approve/reject)
4. Add or remove books from the library
5. Monitor all borrowing activities

## Project Structure

```
library-app-crsr/
├── backend/
│   ├── models/
│   │   ├── Book.js
│   │   ├── User.js
│   │   └── Borrowing.js
│   ├── routes/
│   │   ├── books.js
│   │   ├── users.js
│   │   └── borrowings.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── BookList.js
│   │   │   ├── BookDetail.js
│   │   │   ├── MyBorrowings.js
│   │   │   ├── Profile.js
│   │   │   └── AdminPanel.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
├── config.env
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue in the repository.

## Future Enhancements

- Email notifications for borrowing requests and due dates
- Book reviews and ratings
- Advanced search with filters
- Book recommendations
- Fine calculation for overdue books
- Book reservation system
- Mobile app version
- Integration with external book APIs
