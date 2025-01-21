const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./model/usermodel");
const Post = require("./model/postmodel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const usermodel = require("./model/usermodel");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set("views engine", "ejs");

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  // res.send('Hello World!');
  res.render("index.ejs");
});

app.post("/create", async (req, res) => {
  const { name, email, age, password } = req.body;
  if (!name || !email || !password) {
    return res.status(500).json({ error: "All fields are required." });
  }

  const user = await usermodel.findOne({ email: email });
  if (user) return res.status(500).send({ error: "User already exists." });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) throw err;
      const newUser = await usermodel.create({
        name,
        email,
        age,
        password: hash,
      });
      let token = jwt.sign({ email: email, userId: newUser._id }, "shhh");
      res.cookie("token", token);
      res.status(200).json({ message: "User created successfully." });
    });
  });
});

app.get('/login', (req ,res)=>{ 
     res.render('login.ejs')
     })


app.post("/login", async (req, res) => {
     const {email , password} = req.body;
     if(!email || !password){
          return res.status(500).json({error: "All fields are required."});
     }
     const user = await usermodel.findOne({email: email});
     if(!user) return res.status(500).json({error: "User does not exist."});
     bcrypt.compare(password, user.password, (err, result)=>{
          if(err) throw err;
          if(result){
               let token = jwt.sign({email: email, userId
                    : user._id}, "shhh");
               res.cookie("token", token);
               res.status(200).json({message: "User logged in successfully."});
          }
          else{
               res.status(500).json({error: "Invalid credentials."});
          }
     }
     )
})

function isloggedin(req ,res ,next){ 
     
     let token  = req.cookies.token ; 

     if(token === "") res.send("you must be login")
     else{ 
 let data = jwt.verify(token ,"shhh");
    req.user = data; 
   next();
     }
}

app.get('/profile' ,isloggedin,  (req,res)=>{ 
     res.send(req.user);
})

app.get('/logout' ,(req,res)=>{ 
     res.clearCookie('token');
     res.redirect('/login')
})

app.listen(3000, () => console.log("Server is running on port 3000..."));
