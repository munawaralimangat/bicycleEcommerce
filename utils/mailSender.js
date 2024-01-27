const nodemailer = require('nodemailer')

const mailsender = async (email,title,body)=>{
    try {
        let transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        });

        let info = await transporter.sendMail({
            from:process.env.MAIL_USER,
            to:email,
            subject:title,
            html:body
        });
        console.log("Email info :",info);
        return info
    } catch (error) {
        console.error(error)
    }
}

module.exports = mailsender;