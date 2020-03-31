const mongoose = require('mongoose');
const validator = require('validator');

const types = mongoose.Schema.Types;

const User = mongoose.model('User', {
    name: {
        type: types.String,
        trim: true,
        default: 'Anonymous',
    },
    age: {
        type: types.Number,
        default: 0,
        validate(value) {
            if (value <= 0) throw new Error('Age must be greater than 0');
        }
    },
    email: {
        type: types.String,
        trim: true,
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

module.exports = User;

// let me = new User({
//     age: 23,
//     email: 'auba@rediff.com  ',
//     password: ' acas '
// });

// me.save().then(me => {
//     console.log('saved');
//     console.log(me);
// }).catch(error => {
//     console.log('Oops');
//     console.log(error.message);
// });