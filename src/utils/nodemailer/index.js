// require("dotenv").config();
// const nodemailer = require("nodemailer");

// let mailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.gmail,
//     pass: process.env.pass,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// let details = {
//   from: process.env.gmail,
//   to: req.body.email,
//   subject: "Welcome to pettrip!",
//   text: "You have been successfully registered with the email",
// };

// mailTransporter.sendMail(details, (error) => {
//   if (error) {
//     console.log(error.message);
//   } else {
//     console.log(`email sent`);
//   }
// });

// //const mail = async () => {
// //try {
// //let testAccount = await nodemailer.createTestAccount();

// //console.log(testAccount);

// //let transporter =
// // exports.transporter = nodemailer.createTransport({
// //   host: 'smtp.gmail.com',
// //   port: 465,
// //   secure: true, // true for 465, false for other ports
// //   auth: {
// //     user: 'pettrip.app@gmail.com', // generated ethereal user
// //     pass: 'thrmlydgtbbhulfs', // generated ethereal password
// //   },
// // });

// // let info = await transporter.sendMail({
// //   from: '"Prueba Nodemailer PetTrip" <pettrip.app@gmail.com>', // sender address
// //   to: 'matiasangelani2@gmail.com', // list of receivers
// //   subject: 'Hello', // Subject line
// //   //text: 'Hello world?', // plain text body
// //   //html: '<b>Hello world?</b>', // html body
// // });

// //console.log('Message sent: %s', info.messageId);
// // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// // Preview only available when sending through an Ethereal account
// // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
// // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// //} catch (error) {
// //console.log(error);
// //}
// //};

// //mail();

// // module.exports = {
// //   mail,
// // };
