const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    }
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

userSchema.pre('save', async function() {
    const user = this;
    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8);
});

const User = mongoose.model('User', userSchema);

module.exports = User;