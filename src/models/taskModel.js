const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true,
});

taskSchema.methods.toJSON = function() {
    const task = this.toObject();
    delete task.__v;
    delete task.owner;
    return task;
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;