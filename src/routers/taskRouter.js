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

router.get('/tasks', auth, async(req, res) => {
    let match = {};
    if ('status' in req.query) {
        match.status = req.query.status;
        if (match.status != 'true' && match.status != 'false')
            return res.status(400).send('improper query values');
    }
    const user = req.user;
    let sort = {};
    if (req.query.sortBy) {
        let parts = req.query.sortBy.split(':');
        parts[1] = parts[1] === 'asc' ? 1 : -1;
        sort[parts[0]] = parts[1];
    }
    await user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort,
        }
    }).execPopulate();
    if (user.tasks.length == 0)
        return res.status(404).send('No tasks found');
    return res.send(user.tasks);
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