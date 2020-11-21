require('dotenv').config();
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Set up Morgan
const logger = require('morgan');
app.use(logger('dev'));

// Set up CORS
const cors = require('cors');
app.use(cors());

// Allow server to parse data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Initalize MongoDB
const initializeDB = require('./config/db.config');
const db = initializeDB();

// Set API routes
const usersRouter = require('./routes/users.routes');
const authRouter = require('./routes/auth.routes');
const videosRouter = require('./routes/videos.routes');

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/videos', videosRouter);

// Run server on port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`),
);
