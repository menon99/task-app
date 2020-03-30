const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

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

let t1 = new Task({});

t1.save().then(result => {
    console.log(result);
    console.log('done');
}).catch(error => {
    console.log('Oops');
    console.log(error.message);
});