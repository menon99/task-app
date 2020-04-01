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

app.patch('/users/:id', async(req, res) => {
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

app.delete('/users/:id', async(req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).send('User not found');
        return res.status(200).send(user);
    } catch (e) {
        res.status(400).send('Invalid id structure');
    }
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

app.patch('/tasks/:id', async(req, res) => {
    const allowedUpdates = ['description', 'status'];
    const updates = Object.keys(req.body);
    const isValidUpdates = updates.every(element => {
        return allowedUpdates.includes(element);
    });
    console.log(isValidUpdates);
    if (!isValidUpdates)
        return res.status(406).send('invalid Updates!');
    try {
        let task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task)
            return res.status(404).send('Status not found');
        res.status(205).send(task);
    } catch (e) {
        res.status(400).send('Update not valid');
    }
});

app.delete('/tasks/:id', async(req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).send('Task not found');
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send('invalid id structure');
    }
})

app.listen(port, () => {
    console.log('Server running on port ' + port);
});