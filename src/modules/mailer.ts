import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { host, port, user, pass } from '../config/mail.json';
import path from 'path';

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
});


transport.use('compile', hbs({
    viewEngine: {
        extName: 'handlebars',
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

export default transport;