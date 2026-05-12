require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"BankLedger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationemail(userEmail,name)
{
 
    const subject="Welcome to BankLedger";
    const text=`Hello ${name},\n\nWelcome to BankLedger! We are thrilled to have you on board.\n\nThank you for registering to our website. You can now explore our platform and experience secure, seamless transactions.\n\nBest regards,\nThe BankLedger Team`;
    
    const html=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
          <h2 style="color: #2c3e50; margin: 0;">BankLedger</h2>
        </div>
        <div style="padding: 20px 0;">
          <h3 style="color: #333;">Hello ${name},</h3>
          <p style="color: #555; line-height: 1.6;">
            Welcome to <strong>BankLedger</strong>! We are thrilled to have you on board.
          </p>
          <p style="color: #555; line-height: 1.6;">
            Thank you for registering to our website. You can now explore our platform and experience secure, seamless transactions.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL || '#'}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          </div>
        </div>
        <div style="padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
          <p>If you did not create this account, please ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} BankLedger. All rights reserved.</p>
        </div>
      </div>
    `;
    
    await sendEmail(userEmail,subject,text,html);
    console.log("Email sent successfully")
}

async function sendTransactionemail(userEmail, name, amount, toaccount)
{
        const subject="Transaction Confirmation";
        const text=`Hello ${name},\n\nYour transaction of ${amount} to ${toaccount} has been completed successfully.\n\nBest regards,\nThe BankLedger Team`;
        const html=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
            <h2 style="color: #2c3e50; margin: 0;">BankLedger</h2>
            </div>
            <div style="padding: 20px 0;">
            <h3 style="color: #333;">Hello ${name},</h3>
            <p style="color: #555; line-height: 1.6;">
                Your transaction of ${amount} to ${toaccount} has been completed successfully.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || '#'}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
            </div>
            <div style="padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
            <p>If you did not create this transaction, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} BankLedger. All rights reserved.</p>
            </div>
        </div>
        `;
        await sendEmail(userEmail,subject,text,html);
        console.log("Email sent successfully")
}

async function sendTransactionFailedemail(userEmail, name, amount, toaccount)
{
        const subject="Transaction Failed";
        const text=`Hello ${name},\n\nYour transaction of ${amount} to ${toaccount} has been failed.\n\nBest regards,\nThe BankLedger Team`;
        const html=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0;">
            <h2 style="color: #2c3e50; margin: 0;">BankLedger</h2>
            </div>
            <div style="padding: 20px 0;">
            <h3 style="color: #333;">Hello ${name},</h3>
            <p style="color: #555; line-height: 1.6;">
                Your transaction of ${amount} to ${toaccount} has been failed.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || '#'}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
            </div>
            <div style="padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
            <p>If you did not create this transaction, please ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} BankLedger. All rights reserved.</p>
            </div>
        </div>
        `;
        await sendEmail(userEmail,subject,text,html);
        console.log("Email sent successfully")
}




module.exports = {sendRegistrationemail,sendTransactionemail,sendTransactionFailedemail};
