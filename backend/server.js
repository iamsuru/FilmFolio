const express = require('express');
const path = require('path')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3500;

// Import Firebase setup
require('./db/firebase')  // This will run the firebase.js code


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.end("API WORKING");
})

// Importing routes
const userRouter = require('./routes/UserRouter')
app.use('/api/user', userRouter);

const searchMovieRouter = require('./routes/SearchMovieRouter')
app.use('/api/movie', searchMovieRouter)

const playlistRouter = require('./routes/PlayListRouter')
app.use('/api/user', playlistRouter);

const sharedRouter = require('./routes/SharedRouter')
app.use('/api/shared', sharedRouter);

const privacyRouter = require('./routes/PrivacyRouter')
app.use('/api/playlist', privacyRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
});