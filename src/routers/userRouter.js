const express = require("express");

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
    await user.save();
    res.send(user);
});

router.post('/users/logout/all', auth, async(req, res) => {
    const user = req.user;
    user.tokens = [];
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

module.exports = router;