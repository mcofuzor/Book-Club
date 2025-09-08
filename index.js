//import all necessary modules thats is neeeded

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import env from "dotenv";


const app = express();
const port = 3000;
env.config();


//connect to the postgre DB

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

//Using the passport and bodyparse middlware to locatte the statics files in the public folder and connect to passport session

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(cookieParser());

let books = [];


//Using expresssjs get to render the index page and using sql select state to restrieve books from the db
app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 5;

  const result = await db.query("SELECT books.id, books.title, books.summary, books.rating, books.readdate, books.userid, books.note, books.summary, books.author, books.isbn, admin.firstname, admin.lastname FROM books JOIN admin ON userid=admin.id ORDER BY books.id ASC");
  const queryResult = result.rows;
  books= queryResult;
  // console.log(books)

  const totalPages = Math.ceil(books.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBooks = books.slice(startIndex, endIndex);

  res.render("index.ejs", {
    books: paginatedBooks,
    page: page,
    totalPages: totalPages
  });
});

// const authMiddleware = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) return res.status(403).json({ error: "Unauthorized" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ error: "Invalid token" });
//     req.userId = decoded.userId;
//     next();
//   });
// };

const authorizeMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token)
  if (!token) return res.redirect("/admin");

  jwt.verify(token, "mcexclusivemembertoken", (err, decoded) => {
    if (err) return res.redirect("/admin");
    req.userId = decoded.userId;
    next();
  });
};

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
    // const {username, pass} = req.body;
    // console.log(user);
    if (!user || !pass) {
      res.render("admin.ejs", {
        error: "Please enter both username and password.",
      });
      return;
    }

    try {
        const result = await db.query("SELECT * FROM admin WHERE username=($1) AND userpass=($2)", [user, pass]);
        const data = result.rows[0];
        const token = jwt.sign({ userID: data.id }, "mcexclusivemembertoken", {expiresIn:'2h'});
    // console.log(token);

   if (data) {
    const userID = data.id;
    const cData = {firstname: data.firstname, lastname: data.lastname, username: data.username, id: userID, usertype:data.usertype};

   res.cookie("token", token, { httpOnly: true });
res.cookie("data", cData, { httpOnly: true });

    const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 
    //  console.log(bookResult);
     
   
    res.render("main.ejs", {
        userlogin: data,
        books: abooks, 
        token: token,
       
    })
  } else {
    res.render("admin.ejs", {
      error: "Login Unsuccessful, Please Enter The Details Correctly.",
    })
  }
  }
    
  catch(err){
    // console.log(err)
    res.render("admin.ejs", {
        error: "Login Unsuccessful, Please Enter The Details Correctly.",

    })
}


  });

  app.get("/main", authorizeMiddleware, async (req, res) => {
    const data = req.cookies.data;
    const userID = data.id;
    const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 
    // console.log(userID)
    res.render("main.ejs", {
        userlogin: data,
        books: abooks
    });

  });

  app.get("/logout", (req, res) => {
    // Clear the token from local storage or cookies
    res.clearCookie("token");
    res.clearCookie("UserId");
    res.redirect("/");
  });

  //Using expressjs to render the add page with the adduser endpoint
  app.get("/adduser", authorizeMiddleware, async (req, res) => {
    const data = req.cookies.data;
    const userID = req.body.userID;
    res.render("add.ejs", {
        userID: userID,
        userlogin: data
    });
  });

  //Inserting admin data into the admin table with sql insert query
  app.post("/add", authorizeMiddleware, async (req, res) => {
    const userID = req.cookies.data.id;
    // console.log(userID);
    const fname = req.body.fname;
    const lname = req.body.lname;
    const username = req.body.uname;
    const type = req.body.type;
    const password = req.body.upass;

    
     const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = result.rows[0];

      const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 

    if (password.length < 6) {
      res.render("add.ejs", {
        error: "Password Must Be Minimum Of 6 Letter",
        userlogin: data,
        userID:userID,
        books: abooks

      })
    }

    try {
        await db.query("INSERT INTO admin (username, userpass, firstname, lastname, usertype) VALUES (($1), ($2), ($3),($4),($5))", [username,  password, fname, lname, type]);
       

    res.redirect("/main")
    res.render("main.ejs", {
        successmsg: "User Created Successfully",
        userlogin: data,
        books: abooks
        });

    }})
    } catch(err){
        // console.log(err)
        const data = req.cookies.data
        // res.redirect("/adduser")
        res.render("add.ejs", {
            userID: userID,
            userlogin: data,
            error: "Account Not Created.",

        })
    } 

  });

  app.post('/clear-error', (req, res) => {
  // Clear error for the session/user in your database here
  // Example: await db.query("UPDATE users SET error = NULL WHERE id = $1", [req.session.userId]);
  res.json({ success: true });
});

  
  app.get("/new/:id", authorizeMiddleware, async (req, res) => {
    const data = req.cookies.data;
    const userID = parseInt(req.params.id);
    // console.log(userID)
    res.render("new.ejs", {userID:userID, userlogin:data});
  });

  app.post("/newnote", authorizeMiddleware, async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const rate = req.body.rate;
    const notedate = new Date();
    const note = req.body.note;
    const isbn = req.body.isbn;
    const summary = req.body.summary;

    const userID = parseInt(req.body.userID);
    // console.log(userID)
     const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = result.rows[0];
    try {
        await db.query("INSERT INTO books (title, rating, readdate, userid, note, author, isbn, summary) VALUES (($1), ($2), ($3),($4),($5),($6),($7), ($8))", [title,  rate, notedate, userID, note,  author, isbn, summary]);
        const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
    const bookResult = allbook.rows;
     const abooks= bookResult; 

    

     db.end
     res.redirect("/main")
     res.render("main.ejs", {
       userlogin: data,
        books: abooks

     })
      } catch (err) {
        console.log(err);
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
        // console.error(err)
        }

  })

   app.get("/amore/:id", authorizeMiddleware, async (req, res) => {
    const data = req.cookies.data;
    const userID = data.id;
    const bookID = parseInt(req.params.id);
    try {const result = await db.query("SELECT * FROM books WHERE id=($1)", [bookID]);
    const ebooks = result.rows[0];
    res.render("authmore.ejs", {
        book:ebooks,
        userlogin: data
        });} catch(err){
        // console.error(err)
        }

  })
  


app.post("/edit/:id", authorizeMiddleware, async (req, res) => {
    const bookID = parseInt(req.params.id);
    const userID = req.body.userID;
    // console.log(userID);

    const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
    const data = result.rows[0];

    
    
    const allbook = await db.query("SELECT * FROM books  WHERE id=($1)", [bookID]);
    const bookResult = allbook.rows[0];
    // console.log(bookResult.id)
     const ebooks= bookResult; 
     console.log(ebooks)
 
     res.render("edit.ejs", {
    ebook:ebooks, 
    userlogin:data});
});


app.post("/update", authorizeMiddleware, async (req, res) => {
    const bookID = req.body.id;
    const title = req.body.title;
    const author = req.body.author;
    const rate = req.body.rate;
    const note = req.body.note;
    const isbn = req.body.isbn;
    const summary = req.body.summary
    const userID = parseInt(req.body.userID);
    console.log(summary)

    try {
        await db.query("UPDATE books SET title=($1), rating=($2), userid=($3), note=($4), author=($5), isbn=($6), summary=($7) WHERE id=($8)", [title,  rate, userID, note,  author, isbn, summary, bookID]);

        const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
        const bookResult = allbook.rows;
         const abooks= bookResult; 
db.end
    
     res.render("main.ejs", {
        userlogin: data,
        books: abooks,})
      } catch (err) {
        // console.log(err);
      }
  }else {
    res.render("admin.ejs")
  }});

app.post("/delete/:id", authorizeMiddleware, async (req, res) => {
    const bookID = parseInt(req.params.id);
    const userID = req.user.id;
   db.query("DELETE FROM  books WHERE id=($1)", [bookID]);

  const allbook = await db.query("SELECT * FROM books  WHERE userid=($1) ORDER BY id ASC", [userID]);
        const bookResult = allbook.rows;
         const abooks= bookResult; 

     const result = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = result.rows[0];
       res.redirect("/main")
  res.render("main.ejs", {
        books: abooks,});

});

app.get("/changepass", authorizeMiddleware, (req, res) =>{
  const data = req.cookies.data
  const userID = req.body.userID
  res.render("changepass.ejs", {
    userID: userID,
    userlogin: data
  })
})

app.post("/updatepass", authorizeMiddleware, async (req, res) =>{
  const userID = req.cookies.data.id;
  const oldp = req.body.oldpass;
  const newp = req.body.newpass;
  const confirmp = req.body.confirmnewpass;

 

  try {
    const queryOldP = await db.query("SELECT * FROM admin WHERE id=($1)", [userID]);
     const data = queryOldP.rows[0];
     const dbOldP = data.userpass
      //  console.log(dbOldP)

        if (!oldp || !newp || !confirmp) {
    res.render("changepass.ejs", {
      userlogin: data,
      error: "All fields are required."
    });
    return;
  }
  if (newp.length < 6) {
    res.render("add.ejs", {
      error: "Password Must Be Minimum Of 6 Letter",
      userlogin: data
    });
    return;
  }

   if (oldp !== dbOldP) {
  // Old password is incorrect
  res.render("changepass.ejs", {
    userlogin: data,
    error: "Old password is incorrect."
  });
} else if (newp !== confirmp) {
  // New password and confirmation do not match
  res.render("changepass.ejs", {
    userlogin: data,
    error: "New passwords do not match."
  });
} else {
  // Update password
  await db.query("UPDATE admin SET userpass=($1) WHERE id=($2)", [newp, userID]);
  res.render("changepass.ejs", {
    userlogin: data,
    success: "Password updated successfully."
  });
}
  
  } catch(error){
    // console.log(error)
    res.redirect("/changepass")

  }

})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
