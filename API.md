# Book Club API Documentation

## Overview
This document describes the available endpoints in the Book Club application.

## Authentication
The application uses session-based authentication with Passport.js. Users must be logged in to access protected endpoints.

## Endpoints

### Public Endpoints

#### GET /
**Description:** Display public book listing with optional search functionality  
**Parameters:**
- `search` (optional) - Search term to filter books by title, author, or summary
**Response:** HTML page with book listings

#### GET /admin
**Description:** Display admin login page  
**Response:** HTML login form

#### POST /adminlog
**Description:** Authenticate admin user  
**Body Parameters:**
- `username` (required) - User's username
- `password` (required) - User's password  
**Response:** Redirect to `/main` on success, `/admin` on failure

#### GET /more/:id
**Description:** Display detailed book information  
**Parameters:**
- `id` (required) - Book ID  
**Response:** HTML page with book details

### Protected Endpoints (Authentication Required)

#### GET /main
**Description:** User dashboard displaying their books  
**Response:** HTML dashboard page

#### GET /logout
**Description:** Log out current user  
**Response:** Redirect to home page

#### GET /new/:id
**Description:** Display form to add new book  
**Parameters:**
- `id` (required) - User ID  
**Response:** HTML form for adding new book

#### POST /newnote
**Description:** Create a new book review  
**Body Parameters:**
- `title` (required) - Book title
- `author` (required) - Book author
- `isbn` (required) - Book ISBN
- `rate` (required) - Rating (1-10)
- `summary` (required) - Book summary
- `note` (required) - Full review note  
**Response:** Redirect to main dashboard

#### POST /edit/:id
**Description:** Display form to edit book  
**Parameters:**
- `id` (required) - Book ID  
**Response:** HTML form for editing book

#### POST /update
**Description:** Update existing book review  
**Body Parameters:**
- `id` (required) - Book ID
- `title` (required) - Book title
- `author` (required) - Book author
- `isbn` (required) - Book ISBN
- `rate` (required) - Rating (1-10)
- `summary` (required) - Book summary
- `note` (required) - Full review note  
**Response:** Redirect to main dashboard

#### POST /delete/:id
**Description:** Delete book review  
**Parameters:**
- `id` (required) - Book ID  
**Response:** Redirect to main dashboard

### Admin-Only Endpoints

#### GET /adduser
**Description:** Display form to add new user (admin only)  
**Response:** HTML form for adding new user

#### POST /add
**Description:** Create new user (admin only)  
**Body Parameters:**
- `fname` (required) - First name
- `lname` (required) - Last name
- `uname` (required) - Username
- `upass` (required) - Password
- `type` (required) - User type (admin/user)  
**Response:** Redirect to main dashboard

## Error Handling
- Invalid authentication redirects to login page
- Missing required fields show error messages
- Database errors are caught and display user-friendly messages
- 404 errors for non-existent resources

## Security Features
- Password hashing with bcrypt
- Session management
- Role-based access control
- Input validation
- XSS protection headers
- CSRF protection (basic)

## Data Models

### User (Admin table)
- `id` - Primary key
- `username` - Unique username
- `userpass` - Hashed password
- `firstname` - User's first name
- `lastname` - User's last name
- `usertype` - Role (admin/user)

### Book
- `id` - Primary key
- `title` - Book title
- `author` - Book author
- `isbn` - Book ISBN
- `rating` - Rating (1-10)
- `readdate` - Date review was created
- `summary` - Book summary
- `note` - Full review
- `userid` - Foreign key to admin table

## External Dependencies
- Open Library API for book cover images
- PostgreSQL database
- Express.js framework
- Passport.js for authentication