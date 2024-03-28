var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'daleurquhart1@gmail.com',
        pass: 'mqzl pjeg uvlt tikg' //app password for NodeMailer
    }
})

var mailOptions = {
    from:       'daleurquhart1@gmail.com',
    to:         'daleurquhart1@upei.ca',
    subject:    'Subject.',
    text:       'Message.'
}

transporter.sendMail(mailOptions, function(err, info){
    if(err) console.log(err)
    else    console.log('email sent to ' + info.repsonse)
})  