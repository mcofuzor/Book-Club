//import all necessary modules thats is neeeded

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

//connect to the postgre DB

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "mybooknote",
  password: "school123",
  port: 5432,
});
db.connect();

//Using the bodyparse middlware to locatte the statics files in the public folder

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let books = [];

async function  getAllBook (userID) {
    
     return abooks

}

//Using expresssjs get to render the index page and using sql select state to restrieve books from the db
app.get("/", async (req, res) => {
  const result = await db.query("SELECT books.id, books.title, books.rating, books.readdate, books.userid, books.note, books.summary, books.author, books.isbn, admin.firstname, admin.lastname FROM books JOIN admin ON userid=admin.id ORDER BY books.id ASC");
  const queryResult = result.rows;
  books= queryResult;
  console.log(books)
  res.render("index.ejs", {
    books: books,
  });
});

//Using the expressjs get to get the admin page
app.get("/admin", async (req, res) => {
    res.render("admin.ejs");
  });

const userlogin= [];
const userAuthen = false;

//authenticating the admin login with endpoint and using sql select statement to retrieve the admin data
app.post("/adminlog", async (req, res) => {
    const user = req.body.username;
    const pass = req.body.pass;
    try {
        const result = await db.query("SELECT * FROM admin WHERE username=($1) AND userpass=($2)", [user, pass]);
        const data = result.rows[0];
    const userID = data.id;
    const userType =data.usertype;

   
    const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 
     console.log(bookResult);
   
    res.render("main.ejs", {
        userlogin: data,
        books: abooks, 
       
    })
    
  }
    
  catch(err){
    console.log(err)
    res.render("admin.ejs", {
        error: "Login Unsuccessful, Please Enterr The Details Correctly.",

    })
}


  });

  //Using expressjs to render the add page with the adduser endpoint
  app.get("/adduser", async (req, res) => {
    const userID = req.body.userID;
    res.render("add.ejs", {
        userID: userID
    });
  });

  //Inserting admin data into the admin table with sql insert query
  app.post("/add", async (req, res) => {
    const userID = req.body.userID;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.uname;
    const type = req.body.type;
    const password = req.body.upass;
    try {
        await db.query("INSERT INTO admin (username, userpass, firstname, lastname, usertype) VALUES (($1), ($2), ($3),($4),($5))", [username,  password, fname, lname, type]);
        const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 

     const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = result.rows[0];

        
    res.render("main.ejs", {
        userlogin: data,
        books: abooks
        });
    } catch(err){
        console.log(err)
        res.render("add.ejs", {
            userID: userID,
            error: "Account Not Created.",

        })
    }

  });

  
  app.get("/new/:id", async (req, res) => {
    const userID = parseInt(req.params.id);
    console.log(userID)
    res.render("new.ejs", {userID:userID});
  });

  app.post("/newnote", async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const rate = req.body.rate;
    const notedate = new Date();
    const note = req.body.note;
    const isbn = req.body.isbn;
    const userID = parseInt(req.body.userID);
    console.log(userID)
    try {
        await db.query("INSERT INTO books (title, rating, readdate, userid, note, author, isbn) VALUES (($1), ($2), ($3),($4),($5),($6),($7))", [title,  rate, notedate, userID, note,  author, isbn]);
        const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 

     const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = result.rows[0];

     db.end
     res.render("main.ejs", {
        userlogin: data,
        books: abooks,})
      } catch (err) {
        console.log(err);
      }
  });


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
});


app.post("/update", async (req, res) => {
    const bookID = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const rate = req.body.rate;
    const note = req.body.note;
    const isbn = req.body.isbn;
    const userID = parseInt(req.body.userID);

    try {
        await db.query("UPDATE books SET title=($1), rating=($2), userid=($3), note=($4), author=($5), isbn=($6) WHERE id=($7)", [title,  rate, userID, note,  author, isbn, bookID]);

        const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
        const bookResult = allbook.rows;
         const abooks= bookResult; 

     const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = result.rows[0];
db.end
    
     res.render("main.ejs", {
        userlogin: data,
        books: abooks,})
      } catch (err) {
        console.log(err);
      }
  });

app.post("/delete/:id", async (req, res) => {
    const bookID = parseInt(req.params.id);
    const userID = req.body.userID;
  await db.query("DELETE FROM  books WHERE id=($1)", [bookID]);

  const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
        const bookResult = allbook.rows;
         const abooks= bookResult; 

     const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = result.rows[0];
  res.render("main.ejs", {
        userlogin: data,
        books: abooks,});

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
