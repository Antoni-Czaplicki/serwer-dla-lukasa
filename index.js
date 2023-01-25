const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path'); // this is needed to serve the HTML files

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
    // check if the user exists in the database
    // and if the password is correct
    if (username === 'user' && password === 'password') {
        return done(null, {username});
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    done(null, {username});
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send('logged in');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.send('logged out');
});

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('authenticated');
    } else {
        res.sendFile(path.join(__dirname + '/login.html'));
    }
});

app.post('/signup', (req, res) => {
    // here you will need to handle the form data and validate the email, username and passwords
    // you will also need to check if the user already exists in your database
    // if everything is valid then you can create the user and redirect to the login page
    // otherwise you will need to return an error message and render the signup page again
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname + '/signup.html'));
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
