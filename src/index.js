const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

const app = express();

app.use(userRouter);
app.use(taskRouter);
app.use(express.json());

const port = process.env.PORT || 8000;

app.get('', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});