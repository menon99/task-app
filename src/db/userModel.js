const mongoose = require('mongoose');
const validator = require('validator');

const types = mongoose.Schema.Types;

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

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
        validate(value) {
            if (!validator.isEmail(value)) throw new Error('Not a valid email');
        }
    }
});

let me = new User({
    age: 23,
    email: ' laca@rediff.com  ',
});

me.save().then(me => {
    console.log('saved');
    console.log(me);
}).catch(error => {
    console.log('Oops');
    console.log(error.message);
});