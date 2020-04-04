const express = require('express');

const auth = require('../middleware/auth');
const Task = require('../models/taskModel');

const router = express.Router();
router.use(express.json());

router.post('/tasks', auth, (req, res) => {
    let t1 = new Task({
        ...req.body,
        owner: req.user._id
    });
    t1.save().then(task => {
        res.status(201).send(task);
    }).catch(error => {
        res.status(400).send(error.message);
    });
});

router.get('/tasks', auth, (req, res) => {
    Task.find({ owner: req.user._id }).then(tasks => {
        if (!tasks)
            return res.status(404).send('No tasks found');
        res.send(tasks);
    }).catch(error => {
        req.status(500).send('service down');
    });
});

router.get('/tasks/:id', auth, (req, res) => {
    Task.findOne({ _id: req.params.id, owner: req.user._id }).then(task => {
        res.status(200).send(task);
    }).catch(error => {
        return res.status(404).send('Task not found');
    });
});

router.patch('/tasks/:id', auth, async(req, res) => {
    const allowedUpdates = ['description', 'status'];
    const updates = Object.keys(req.body);
    const isValidUpdates = updates.every(element => {
        return allowedUpdates.includes(element);
    });
    if (!isValidUpdates)
        return res.status(406).send('invalid Updates!');
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task)
            return res.status(404).send('No such task');
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.delete('/tasks/:id', auth, (req, res) => {
    Task.findOne({ _id: req.params.id, owner: req.user._id }).then(task => {
        task.remove();
        res.status(200).send(task);
    }).catch(error => {
        return res.status(404).send('Task not found');
    });
});

module.exports = router;