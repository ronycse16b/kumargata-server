import nodemailer from 'nodemailer';

const sendEmail = async ({email, subject, html}) => {

    
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.USER,
                pass: process.env.APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: {
                name:'Daulkhar Union',
                address:process.env.USER,
            },
            
            to:[email],
            subject: subject,
            html: html,
        });

       return  "Email sent successfully";
    } catch (error) {
        console.error(error);
    }
};

export default sendEmail;
