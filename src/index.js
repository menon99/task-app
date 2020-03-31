const express = require('express');
require('./db/mongoose');

const User = require('./models/userModel');
const Task = require('./models/taskModel');

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.get('', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.post('/users', (req, res) => {
    let u1 = new User(req.body);
    u1.save().then(user => {
        res.status(201);
        res.send(user);
    }).catch(error => {
        res.status(400);
        res.send(error.message);
    });
});

app.get('/users/', (req, res) => {
    User.find().then(users => {
        res.status(202).send(users);
    }).catch(error => {
        res.status(500).send('service down');
    });
});

app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id).then(user => {
        res.status(200).send(user);
    }).catch(error => {
        res.status(404).send('No such user found!');
    });
});

app.post('/tasks', (req, res) => {
    let t1 = new Task(req.body);
    t1.save().then(task => {
        res.status(201).send(task);
    }).catch(error => {
        res.status(400).send(error.message);
    });
});

app.get('/tasks', (req, res) => {
    Task.find().then(tasks => {
        res.send(tasks);
    }).catch(error => {
        req.status(500).send('service down');
    });
});

app.get('/tasks/:id', (req, res) => {
    let id = req.params.id;
    Task.findById(id).then(task => {
        res.send(task);
    }).catch(error => {
        res.status(404).send('No such task found!');
    });
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});