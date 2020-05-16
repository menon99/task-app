const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });
        if (!user) {
            res.status(400).send('Authentication failed');
        }
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(400).send('Authentication failed');
    }
};

module.exports = auth;