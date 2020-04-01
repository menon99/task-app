const express = require('express');

const Task = require('../models/taskModel');

const router = express.Router();

router.post('/tasks', (req, res) => {
    let t1 = new Task(req.body);
    t1.save().then(task => {
        res.status(201).send(task);
    }).catch(error => {
        res.status(400).send(error.message);
    });
});

router.get('/tasks', (req, res) => {
    Task.find().then(tasks => {
        if (!tasks)
            return res.status(404).send('No tasks found');
        res.send(tasks);
    }).catch(error => {
        req.status(500).send('service down');
    });
});

router.get('/tasks/:id', (req, res) => {
    let id = req.params.id;
    Task.findById(id).then(task => {
        if (!task)
            return res.status(404).send('task not found');
        res.send(task);
    }).catch(error => {
        res.status(400).send('Invalid id format');
    });
});

router.patch('/tasks/:id', async(req, res) => {
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

router.delete('/tasks/:id', async(req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);
        if (!task)
            return res.status(404).send('Task not found');
        res.status(200).send(task);
    } catch (e) {
        res.status(400).send('invalid id structure');
    }
});

module.exports = router;