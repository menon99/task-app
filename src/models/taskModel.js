const mongoose = require('mongoose');

const Task = mongoose.model('task', {
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false,
    }
});

module.exports = Task;

// let t1 = new Task({});

// t1.save().then(result => {
//     console.log(result);
//     console.log('done');
// }).catch(error => {
//     console.log('Oops');
//     console.log(error.message);
// });