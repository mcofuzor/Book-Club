# Book Club Application

Michael's Book Club is a web application for book reviews and comments by members of the club, and for public viewing. Each member of the club has access that enables them to post and review books. Members are categorized into two types: "Admin" and "User". The Admin category is authorized to add new users.

## Features

- **Public Book Listing**: Browse all books with reviews and ratings
- **Search Functionality**: Search books by title, author, or summary
- **User Authentication**: Secure login system for club members
- **Book Management**: Add, edit, and delete book reviews
- **Role-Based Access**: Admin and User roles with different permissions
- **Book Cover Integration**: Automatic book cover images from Open Library
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Frontend**: EJS templates with CSS
- **Authentication**: Passport.js with local strategy
- **External API**: Open Library for book covers

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Book-Club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   
   Create a PostgreSQL database and run the SQL commands from `queries.sql` to create the necessary tables:
   ```sql
   -- Create admin table
   CREATE TABLE IF NOT EXISTS public.admin (
       id integer NOT NULL DEFAULT nextval('admin_id_seq'::regclass),
       username character varying(90) NOT NULL,
       userpass character varying(90) NOT NULL,
       firstname character varying(90),
       lastname character varying(90),
       usertype character varying(50),
       CONSTRAINT admin_pkey PRIMARY KEY (id),
       CONSTRAINT admin_username_key UNIQUE (username)
   );

   -- Create books table
   CREATE TABLE IF NOT EXISTS public.books (
       id integer NOT NULL DEFAULT nextval('books_id_seq'::regclass),
       title character varying(200) NOT NULL,
       rating integer NOT NULL,
       readdate date NOT NULL,
       userid integer,
       note character varying(10000),
       author character varying(90),
       summary character varying(1000),
       isbn character varying(50) NOT NULL,
       CONSTRAINT books_pkey PRIMARY KEY (id),
       CONSTRAINT books_userid_fkey FOREIGN KEY (userid) REFERENCES public.admin (id)
   );
   ```

4. **Environment Configuration**
   
   Copy `.env.example` to `.env` and update with your database credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   PG_USER=your_postgres_username
   PG_HOST=localhost
   PG_DATABASE=your_database_name
   PG_PASSWORD=your_postgres_password
   PG_PORT=5432
   SESSION_SECRET=your_session_secret_key_here
   PORT=3000
   ```

5. **Create an admin user**
   
   You'll need to create at least one admin user in the database to start using the application:
   ```sql
   INSERT INTO admin (username, userpass, firstname, lastname, usertype) 
   VALUES ('admin', '$2b$10$hashpasswordhere', 'Admin', 'User', 'Admin');
   ```
   
   Note: The password should be hashed using bcrypt with 10 salt rounds.

## Running the Application

1. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development:
   ```bash
   node index.js
   ```

2. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Public book listing is available at the root URL
   - Admin/User login is available at `/admin`

## Usage

### Public Users
- Browse all book reviews on the homepage
- Search for books using the search bar
- Click on book covers to view detailed reviews
- View book summaries and ratings

### Logged-in Users
- Add new book reviews
- Edit their own book reviews
- Delete their own book reviews
- View their personal book collection

### Admin Users
- All user capabilities
- Add new users to the system
- Manage user accounts

## API Endpoints

- `GET /` - Public book listing with optional search
- `GET /admin` - Admin login page
- `POST /adminlog` - Admin login authentication
- `GET /main` - User dashboard (authenticated)
- `GET /adduser` - Add new user form (admin only)
- `POST /add` - Create new user (admin only)
- `GET /new/:id` - Add new book form (authenticated)
- `POST /newnote` - Create new book review (authenticated)
- `GET /more/:id` - View book details
- `POST /edit/:id` - Edit book form (authenticated)
- `POST /update` - Update book review (authenticated)
- `POST /delete/:id` - Delete book review (authenticated)
- `GET /logout` - Logout user

## Security Features

- Password hashing with bcrypt
- Session management with express-session
- Authentication middleware
- Role-based access control
- Input validation on forms

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

Michael-O

## Support

For questions or issues, please create an issue in the repository.

