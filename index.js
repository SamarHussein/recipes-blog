const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();


const User = require('./models/User');

mongoose.connect('mongodb+srv://samar:samar123@cluster0.eb4xu.mongodb.net/authDemo?retryWrites=true&w=majority',
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    },
    ()=>{
        console.log('Connected to database');
    });


app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended : true}));
app.use(session({secret : 'thisissecret'}));

// middleware
 const loggedIn = (req, res, next) => {
     if(! req.session.user_id) {
         return res.redirect('/login')
     }
     next ();
 }


app.get('/', (req, res) => {
    res.send('This is the home page');
});

// register routes
app.get('/register', (req, res) => {
    res.render('register');
})
app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try{

        console.log('username', username)

        const user = new User({ username, password });
        console.log(user);
        await user.save((e) => {
            console.log(e)
        });
        req.session.user_id = user._id;
        console.log(req.session.user_id)
        res.redirect('/');
       
    } catch(err) {
        console.log(err)
    }
       
});

app.get('/secret', loggedIn, (req, res) => {
    res.send('this is secret');
});

//login routes
app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    try {
        const foundUser = await User.findAndValidate( username, password);
        if(!foundUser) {
            console.log('Invalid username or password');
            res.redirect('/login');

        }
        else {
            req.session.user_id = foundUser._id;
            res.send('logged in');
            res.redirect('/posts');

        }
    } catch(e) {
            console.log(e);
            res.send(e.status);
        }
 });


 // logout route
 app.get('/logout', (req, res) => {
     res.send('logout');
 })
 app.post('/logout', (req, res) => {
     //req.session.user_id = null;
     req.session.destroy();
     res.redirect('/login');
 })

 // posts route
 app.get('/posts', (req, res) => {
     if(! req.session.user_id) {
         return res.redirect('/login');
     } 
         res.render('posts')
     
 })
app.listen (3000, (req, res) => {
    console.log(' Server is listening')
});