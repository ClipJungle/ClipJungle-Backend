const User = require('../models/user.model');

// Some simple functions for retrieving users
const getUserByUsername = async (username) => {
    const user = await User.findOne({ username: username });
    return user;
};

const getUserById = async (id) => {
    const user = await User.findOne({ _id: id });
    return user;
};

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email: email });
    return user;
};

module.exports.getUserByUsername = getUserByUsername;
module.exports.getUserById = getUserById;
module.exports.getUserByEmail = getUserByEmail;
