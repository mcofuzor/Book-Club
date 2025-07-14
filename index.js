//import all necessary modules thats is neeeded

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import env from "dotenv";


const app = express();
const port = 3000;
env.config();



app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const saltRounds = 10;

//connect to the postgre DB

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

//Using the passport and bodyparse middlware to locatte the statics files in the public folder and connect to passport session

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

let books = [];


//Using expresssjs get to render the index page and using sql select state to retrieve books from the db
app.get("/", async (req, res) => {
  try {
    const searchTerm = req.query.search;
    let result;
    
    if (searchTerm) {
      // Search functionality
      result = await db.query(
        "SELECT books.id, books.title, books.rating, books.readdate, books.userid, books.note, books.summary, books.author, books.isbn, admin.firstname, admin.lastname FROM books JOIN admin ON userid=admin.id WHERE books.title ILIKE $1 OR books.author ILIKE $1 OR books.summary ILIKE $1 ORDER BY books.id ASC",
        [`%${searchTerm}%`]
      );
    } else {
      // Default query
      result = await db.query("SELECT books.id, books.title, books.rating, books.readdate, books.userid, books.note, books.summary, books.author, books.isbn, admin.firstname, admin.lastname FROM books JOIN admin ON userid=admin.id ORDER BY books.id ASC");
    }
    
    const queryResult = result.rows;
    books = queryResult;
    console.log(books);
    res.render("index.ejs", {
      books: books,
      searchTerm: searchTerm
    });
  } catch (err) {
    console.error("Database error:", err);
    res.render("index.ejs", {
      books: [],
      searchTerm: req.query.search,
      error: "Error loading books. Please try again later."
    });
  }
});

//Using the expressjs get to get the admin page
app.get("/admin", async (req, res) => {
    res.render("admin.ejs");
  });

const userlogin= [];
const userAuthen = false;

//authenticating the admin login with endpoint and using sql select statement to retrieve the admin data
app.post("/adminlog",  
  passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/admin",
    failureMessage: "User Not Found"
   })
  )
   app.get("/main", async (req, res) => {
    if (req.isAuthenticated()) {
    const user = req.user
    const userID = req.user.id;

   try { const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 
     //console.log(bookResult);
     res.render("main.ejs", {
      books: abooks,
      user:user })

   
       
     } catch (err) {
        res.send("No Book Found")
    }
} else {
  res.render("admin.ejs")
}})

  

  //Using expressjs to render the add page with the adduser endpoint
  app.get("/adduser", async (req, res) => {
    if (req.isAuthenticated()) {
      const userID = req.user
    res.render("add.ejs", {userID:userID})}
    else {
      res.render("admin.ejs")
    }
  });

  //Inserting admin data into the admin table with sql insert query
  app.post("/add", async (req, res) => {
    if (req.isAuthenticated()) {
    const user = req.user
    const userID = req.user.id;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.uname;
    const type = req.body.type;
    const password = req.body.upass;
    try {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.log("Error hashing password");
            } else {
     db.query("INSERT INTO admin (username, userpass, firstname, lastname, usertype) VALUES ($1, $2, $3, $4, $5)", [username,  hash, fname, lname, type]);
        const allbook =  await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 
   
     //const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     //const data = result.rows[0];

        
    res.render("main.ejs", {
        //userlogin: data,
        books: abooks,
        user:user
        });

    }})
    } catch(err){
        console.log(err)
        res.render("add.ejs", {
            userID: userID,
            error: "Account Not Created.",

        })
    } 

  }  else {
    res.render("admin.ejs")
  }});


  app.get("/new/:id", async (req, res) => {
    if (req.isAuthenticated()) {
      const userID = req.user
    //const userID = parseInt(req.params.id);
    console.log(userID)
    res.render("new.ejs", {userID:userID}); }
    else {
      res.render("admin.ejs")
    }} );

  app.post("/newnote", async (req, res) => {
    if (req.isAuthenticated()) {
    const title = req.body.title;
    const author = req.body.author;
    const rate = req.body.rate;
    const notedate = new Date();
    const note = req.body.note;
    const isbn = req.body.isbn;
    const summary = req.body.summary;
    const userID = req.user.id;
    
    // Basic validation
    if (!title || !author || !rate || !note || !isbn || !summary) {
      return res.render("new.ejs", {
        userID: req.user,
        error: "All fields are required."
      });
    }
    
    if (rate < 1 || rate > 10) {
      return res.render("new.ejs", {
        userID: req.user,
        error: "Rating must be between 1 and 10."
      });
    }
    
    console.log(userID)
    try {
         db.query("INSERT INTO books (title, rating, readdate, userid, note, author, isbn, summary) VALUES (($1), ($2), ($3),($4),($5),($6),($7), ($8))", [title,  rate, notedate, userID, note,  author, isbn, summary]);
        const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 
    const user = req.user;

     res.render("main.ejs", {
        books: abooks,
        user: user,
        success: "Book added successfully!"
      })
      } catch (err) {
        console.log(err);
        res.render("new.ejs", {
          userID: req.user,
          error: "Error saving book. Please try again."
        });
      } 
  }else {
      res.render("admin.ejs")
  }});


  app.get("/more/:id", async (req, res) => {
   
    const bookID = parseInt(req.params.id);
    try {const result = await db.query("SELECT * FROM books WHERE id=($1)", [bookID]);
    const ebooks = result.rows[0];
    res.render("more.ejs", {
        book:ebooks 
        });} catch(err){
        console.error(err)
        }

  })
  


app.post("/edit/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const bookID = parseInt(req.params.id);
    const userID = req.body.userID;
    console.log(userID);

    const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
    const data = result.rows[0];

    
    
    const allbook = await db.query("SELECT * FROM books  WHERE id=($1)", [bookID]);
    const bookResult = allbook.rows[0];
    console.log(bookResult.id)
     const ebooks= bookResult; 
 
     res.render("edit.ejs", {
    ebook:ebooks, 
    data:data});
} else {
  res.render("admin.ejs")
}});


app.post("/update", async (req, res) => {
  if (req.isAuthenticated()) {
    const bookID = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const rate = req.body.rate;
    const note = req.body.note;
    const isbn = req.body.isbn;
    const summary = req.body.summary;
    const userID = req.user.id;
   // const userID = parseInt(req.body.userID);

    try {
         db.query("UPDATE books SET title=($1), rating=($2), userid=($3), note=($4), author=($5), isbn=($6), summary=($7) WHERE id=($8)", [title,  rate, userID, note,  author, isbn, summary, bookID]);

        const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
        const bookResult = allbook.rows;
         const abooks= bookResult; 
        const user = req.user;
    
     res.render("main.ejs", {
        books: abooks,
        user: user,
        success: "Book updated successfully!"
      })
      } catch (err) {
        console.log(err);
      }
  }else {
    res.render("admin.ejs")
  }});

app.post("/delete/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const bookID = parseInt(req.params.id);
    const userID = req.user.id;
   db.query("DELETE FROM  books WHERE id=($1)", [bookID]);

  const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
        const bookResult = allbook.rows;
         const abooks= bookResult; 
        const user = req.user;

  res.render("main.ejs", {
        books: abooks,
        user: user,
        success: "Book deleted successfully!"
      });

}else {
  res.render("admin.ejs")
}});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

passport.use("local",
  new Strategy(async function verify(username, password, cb) {
   
    try {
      const result = await db.query("SELECT * FROM admin WHERE username = $1 ", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(user)
        const storedHashedPassword = user.userpass;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            //Error with password check
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              //Passed password check
              return cb(null, user);
            } else {
              //Did not pass password check
              return cb(null, false);
            }
          }
        });
      } else {
        const error="User Not Found"
        return cb(null, false);
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
