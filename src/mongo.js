const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// let id = new ObjectID();
// console.log(id.getTimestamp());
// process.exit(0);
MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        console.log(error);
        return 0;
    }
    const db = client.db(databaseName);

    /* Find latest inserted id */


    // db.collection('tasks').find().limit(1).sort({ $natural: -1 }).toArray((error, result) => {
    //     console.log(result);
    // });

    /* Inserting one and many records */

    // db.collection('users').insertOne({
    //     name: 'Akash Menon',
    //     msg: 'Yayy my first mongodb app',
    // }, (error, result) => {
    //     if (error) console.log(error);
    //     else console.log(result.insertedId);
    // });

    // db.collection('users').insertMany([{
    //         name: 'Auba',
    //         age: 30
    //     },
    //     {
    //         name: 'Ozil',
    //         age: 31,
    //     },
    // ], (error, result) => {
    //     if (error) console.log(error);
    //     else console.log(result.ops);
    // });

    // db.collection('tasks').insertMany([{
    //         description: 'Finish this course',
    //         status: false,
    //     },
    //     {
    //         description: 'Do guvi course',
    //         status: false,
    //     },
    //     {
    //         description: 'get ml paper',
    //         status: true,
    //     },
    // ], (error, result) => {
    //     if (error) console.log(error);
    //     else console.log(result.ops);
    // });

    /* Updating */

    // db.collection('tasks').updateMany({
    //     status: false
    // }, {
    //     $set: {
    //         status: true,
    //     }
    // }).then(result => console.log(result)).catch(error => console.log(error));

    /* Deleting */

    db.collection('users').deleteOne({
        name: 'Auba',
    }).then(result => console.log(result)).catch(error => console.log(error));
    db.collection('taskssss').deleteMany({
        status: true,
    }).then(result => console.log(result.result.ok + ' ' + result.deletedCount)).catch(error => console.log(error.message));
});