const express = require('express');

const User = require('../models/userModel');

const router = express.Router();

router.post('/users', (req, res) => {
    let u1 = new User(req.body);
    u1.save().then(user => {
        res.status(201);
        res.send(user);
    }).catch(error => {
        res.status(400);
        res.send(error.message);
    });
});

router.get('/users/', (req, res) => {
    User.find().then(users => {
        if (!users)
            return res.status(404).send('No users found');
        res.status(202).send(users);
    }).catch(error => {
        res.status(500).send('service down');
    });
});

router.get('/users/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id).then(user => {
        if (!user)
            return res.status(404).send('User not found');
        res.status(200).send(user);
    }).catch(error => {
        res.status(400).send('Invalid id format');
    });
});

router.patch('/users/:id', async(req, res) => {
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const updates = Object.keys(req.body);
    const isValidUpdates = updates.every(element => {
        return allowedUpdates.includes(element);
    });
    if (!isValidUpdates)
        return res.status(406).send('Invalid updates');
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user)
            return res.status(404).send('No such user');
        res.status(205).send(user);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/users/:id', async(req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).send('User not found');
        return res.status(200).send(user);
    } catch (e) {
        res.status(400).send('Invalid id structure');
    }
});

module.exports = router;