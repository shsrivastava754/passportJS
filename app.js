const express = require('express');
const app = express();
const port = 3000;

const ejs = require('ejs');
const expressSession = require('express-session');

const users = require('./users');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

const passport = require('passport');
const initializingPassport = require('./passportConfig').initializingPassport;
const isAuthenticated = require('./passportConfig').isAuthenticated;

app.set('view engine','ejs');

// these 3 lines must be added to use express session and in same order mandatory
app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

initializingPassport(passport);

app.get('/',(req,res)=>{
  res.render("index");
});

app.get('/registerUser',(req,res)=>{
  res.render("register");
});

app.get('/loginUser',(req,res)=>{
  res.render("login");
});

app.post('/register',async (req,res)=>{
  const user = await users.findOne({email:req.body.email});
  if(user){
    return res.status(400).send("User already exists!!");
  }

  const newUser = await users.create(req.body);
  res.status(201).send(newUser);
});

app.post('/login',passport.authenticate("local",{failureRedirect:'/loginUser',successRedirect:'/profile'}));

// middleware for profile route access only to logged in peepul
app.get('/profile',isAuthenticated,(req,res)=>{
  res.render("profile");
});

app.get('/logout',(req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
});

app.listen(port,()=>{
  console.log(`Listening on port ${port}`);
});