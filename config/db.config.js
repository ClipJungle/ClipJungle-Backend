const mongoose = require('mongoose');

const initializeDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    const db = mongoose.connection;
    db.once('open', () => console.log(`Connected to Database!`));

    return db;
};

module.exports = initializeDB;
