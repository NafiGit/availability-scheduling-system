import nodemailer from 'nodemailer';
import User from '../models/User';

export const sendSessionNotification = async (session: any, action: 'create' | 'update' | 'cancel' = 'create') => {
  try {
    const user = await User.findById(session.user);
    if (!user) {
      throw new Error('User not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject: string;
    let text: string;

    // Format attendees as a list of names and emails
    const attendeeList = session.attendees.map((attendee: { name: string; email: string }) => {
      return `${attendee.name} <${attendee.email}>`;
    }).join(', ');

    switch (action) {
      case 'create':
        subject = 'New Session Created';
        text = `A new session has been created.\n\nDetails:\nType: ${session.type}\nStart: ${session.start}\nEnd: ${session.end}\nAttendees: ${attendeeList}`;
        break;
      case 'update':
        subject = 'Session Updated';
        text = `A session has been updated.\n\nDetails:\nType: ${session.type}\nStart: ${session.start}\nEnd: ${session.end}\nAttendees: ${attendeeList}`;
        break;
      case 'cancel':
        subject = 'Session Cancelled';
        text = `A session has been cancelled.\n\nDetails:\nType: ${session.type}\nStart: ${session.start}\nEnd: ${session.end}\nAttendees: ${attendeeList}`;
        break;
      default:
        throw new Error('Invalid action type');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending session notification:', error);
  }
};
