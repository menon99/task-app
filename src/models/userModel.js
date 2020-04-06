const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./taskModel');

const types = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name: {
        type: types.String,
        trim: true,
        default: 'Anonymous',
    },
    age: {
        type: types.Number,
        default: 1,
        validate(value) {
            if (value <= 0) throw new Error('Age must be greater than 0');
        }
    },
    email: {
        type: types.String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Not a valid email');
        },
    },
    password: {
        type: types.String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) throw new Error('password should not be "password"');
        }
    },
    avatar: {
        type: types.Buffer,
    },
    tokens: [{
        token: {
            type: types.String,
            required: true,
        }
    }],
}, {
    timestamps: true,
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
});

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email: email });
    if (!user)
        throw new Error('Unable to login');
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
        throw new Error('Unable to login');
    else
        return user;
};

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.__v;
    delete userObject._id;
    delete userObject.avatar;
    return userObject;
};

userSchema.methods.getAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ id: user._id.toString() }, 'lacablood');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.pre('save', async function() {
    const user = this;
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8);
});

userSchema.pre('remove', async function() {
    await Task.deleteMany({ owner: this._id });
});

const User = mongoose.model('User', userSchema);

module.exports = User;