const express = require("express");
const multer = require('multer');
const User = require("../models/userModel");
const auth = require('../middleware/auth');

const router = express.Router();
router.use(express.json());

router.post("/users", async(req, res) => {
    try {
        let user = new User(req.body);
        const token = await user.getAuthToken();
        res.status(202).send({ user, token });
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/users/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getAuthToken();
        res.status(202).send({ user, token });
    } catch (e) {
        res.status(404).send(e.message);
    }
});

router.post('/users/logout', auth, async(req, res) => {
    const user = req.user;
    user.tokens = user.tokens.filter(token => {
        return token.token != req.token;
    });
    if (user.tokens.length == 0)
        user.tokens = undefined;
    await user.save();
    res.send(user);
});

router.post('/users/logout/all', auth, async(req, res) => {
    const user = req.user;
    user.tokens = undefined;
    await user.save();
    res.send('Logged out of all');
});

router.get("/users/me", auth, (req, res) => {
    res.send(req.user);
});

router.patch("/users/me", auth, async(req, res) => {
    const allowedUpdates = ["name", "email", "age", "password"];
    const updates = Object.keys(req.body);
    const isValidUpdates = updates.every(element => {
        return allowedUpdates.includes(element);
    });
    if (!isValidUpdates) return res.status(406).send("Invalid updates");
    try {
        const user = req.user;
        updates.forEach(update => {
            user[update] = req.body[update];
        });
        await user.save();
        res.status(205).send(user);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete("/users/me", auth, async(req, res) => {
    await req.user.remove();
    res.status(200).send(req.user);
});

const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter(req, file, cb) {
        if (file.originalname.match(/\.(jpg|jpeg|png)$/))
            cb(undefined, true);
        else
            cb(new Error('only images'), false);
    },
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send('uploaded');
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send('Avatar deleted');
});

router.get('/users/:id/avatar', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).send('user not found');
        if (!user.avatar)
            return res.status(404).send('user does not have a avatar');
        res.set('Content-type', 'image/jpeg');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send('improper id');
    }
});

module.exports = router;