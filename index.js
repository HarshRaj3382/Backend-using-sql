// step for opning mysql cli =>cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
// then ./mysql -u root -p


const express=require("express");
const app=express();

let port=8080;
const methodOverride=require("method-override");
const path=require("path");// to use public folder css

app.set("view engine","ejs");  //set path for ejs(view engine)
app.set("views",path.join(__dirname,"views"));  //set path for views dir

app.use(express.static(path.join(__dirname,"public")));  //set path for public

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'COLLEGE',
  password: "6051",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connected to MySQL database");
});


let createRandomUser = () => {
    return [
     faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
     
    faker.internet.password(),
     
      ]  ;
  }


let q="select count(*) from user";


// let data=[];
// for(let i=0;i<=100;i++){
//     data.push(createRandomUser());
// }




// connection.query(q,[data], function (err, results) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(results);
// });

// connection.end();



// Api start


// app.patch("/home/:id",(req,res)=>{
//   let {id}=req.params;
//   let {password:formPass,username:newUsername}=req.body;
//   let q = `SELECT * FROM user WHERE userId ='${id}'`;
//   try{
//    connection.query(q,(err,result)=>{
//      if(err) throw err;
//     let user=result[0];
//     if(formPass!=user.password){
//       alert("Password Incorrect,Try Again");
//     }else{

//     }
//      res.render("edit.ejs",{user});
//    });
//   } catch(err){
//    res.send("some error ocured");
//   }
// })


// Delete user route
app.get("/home/:id", (req, res) => {
  if (req.query._method === "DELETE") {
    let { id } = req.params;
    let q = `DELETE FROM user WHERE userId = ?`;

    try {
      connection.query(q, [id], (err, result) => {
        if (err) throw err;
        res.redirect("/home");
      });
    } catch (err) {
      console.log(err);
      res.send("Some error occurred");
    }
  } else {
    // Handle GET request
  }
});



//update route
app.patch("/home/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE userId = ?`;
  let { password: formpass, username: newusername } = req.body;

  try {
    connection.query(q, [id], (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formpass !== user.password) {
        res.send("Wrong password");
      } else {
        let q2 = `UPDATE user SET username = ? WHERE userId = ?`;
        connection.query(q2, [newusername, id], (err, result) => {
          if (err) throw err;
          res.redirect("/home");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in server");
  }
});

// to render edit page
app.get("/home/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE userId = ?`;

  try {
    connection.query(q, [id], (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    res.send("Some error occurred");
  }
});




//render new form
app.get("/home/new",(req,res)=>{
  res.render("new.ejs");
})


// add new A/c
app.post("/home/id", (req, res) => {
  let { userId, username, email, password } = req.body;
  
  let q = `INSERT INTO user(userId, username, email, password) VALUES (?,?,?,?)`;
let data = [userId, username, email, password];
 try {
    connection.query(q, data, (err, result) => {
      if (err) throw err;
      res.redirect("/home");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occurred");
  }
});





// to show table
app.get("/home",(req,res)=>{
  let q = `SELECT * FROM user`;

  try{
   connection.query(q,(err,result)=>{
     if(err) throw err;
     
     
     res.render("show.ejs",{result});
   });
  } catch(err){
   res.send("some error ocured");
  }

})

// to show count 
app.get("/home/count",(req,res)=>{
  let q = `SELECT COUNT(*) AS userCount FROM user`;

   try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let count = result[0].userCount;

      res.render("home.ejs",{count});
    });
   } catch(err){
    res.send("some error ocured");
   }

});


//server listening
app.listen(8080,()=>{
  console.log("server is Working on port 8080");
})

