const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
});

/*
transport.use('compile', hbs({
	viewEngine: 'handlebars',
	partialsDir: path.resolve('./src/resources/mail/auth'),
	viewPath: path.resolve('./src/resources/mail/auth'),
	extName: '.html',
	defaultLayout: 'forgot_password',
}));
*/
const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/resources/mail/auth'),
    layoutsDir: path.resolve('./src/resources/mail/auth'),
    defaultLayout: 'forgot_password.html',
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html',
};




module.exports = transport.use('compile', hbs(handlebarOptions));