const sgMail = require('@sendgrid/mail');

const sendgridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridApiKey);

const sendWelcomeEmail = (to, name) => {
    sgMail.send({
        to: to,
        from: 'task-manager-api@herokuapp.com',
        subject: 'Welcome to our Task Manager API !!',
        text: `Welcome to our API, ${name}. Let us know how you get along with our API`
    }).then(() => console.log('sent'));
};

const sendGoodbyeEmail = (to, name) => {
    sgMail.send({
        to: to,
        from: 'task-manager-api@herokuapp.com',
        subject: 'Removal of Task Manager API account',
        text: `Hello ${name}. Sad to see you go :(. Please let us know what we could have done to keep you`
    }).then(() => console.log('sent'));
};

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail,
};