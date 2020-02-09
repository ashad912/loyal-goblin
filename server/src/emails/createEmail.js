const nodemailer = require('nodemailer')
const Email = require('email-templates')
const path = require('path')
var nodemailerSendgrid  = require('nodemailer-sendgrid');

const createEmail = (res, userEmail, subject, template, strings)=> {
    //const options =  {api_key: process.env.SENDGRID_API_KEY}
    //const client = nodemailer.createTransport(nodemailerSendgrid (options));
    const client = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_GMAIL,
            pass: process.env.EMAIL_PASS
        }
    })
    
    const email = new Email({
        message: {
            from: 'Pub Goblin <no-reply@goblin.hhgstudio.com>',
            to: userEmail,
            subject: subject
        },
        send: process.env.NODE_ENV === 'dev' ? true : true,
        transport: client,
        // preview: {
        //     open: {
        //       app: 'chrome',
        //       wait: false
        //     }
        // }
    });


    email
    .send({
        template:  path.join(__dirname, template),
        locals: strings
    })
    .then(() => {
        res.status(200).send()
    })
    .catch(err => {
        console.log(err)
        if (Object.keys(err).length === 0) {
            res.sendStatus(200);
        } else {
            res.status(400).send(err)
        }
    });
    
    
}

export default createEmail