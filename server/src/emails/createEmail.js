const nodemailer = require('nodemailer')
const Email = require('email-templates')
const path = require('path')
var nodemailerSendgrid  = require('nodemailer-sendgrid');

const createEmail = (res, userEmail, subject, template, strings)=> {
    const options =  {api_key: process.env.SENDGRID_API_KEY}
    const client = nodemailer.createTransport(nodemailerSendgrid (options));
    
    const email = new Email({
        message: {
            from: 'Pub Goblin <no-reply@pubgoblin.pl>',
            to: userEmail,
            subject: subject
        },
        send: false,
        transport: client
    });


    email
    .send({
        template:  path.join(__dirname, template),
        locals: strings
    })
    .then(res => {
        res.sendStatus(200)
    })
    .catch(err => {
        if (Object.keys(err).length === 0) {
            res.sendStatus(200);
        } else {
            res.status(400).send(err)
        }
    });
    
    
}

export default createEmail