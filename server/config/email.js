const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'PlaceHub <noreply@placehub.me>';

// Send OTP email to user
const sendOTPEmail = async (email, otp) => {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'PlaceHub - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Verify Your Email</h2>
        <p style="color: #64748b;">Use the OTP below to verify your PlaceHub account. This code expires in 5 minutes.</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

// Send status-update email when admin changes application status
const sendStatusEmail = async (email, studentName, jobTitle, company, status) => {
  const statusColors = {
    Pending: '#f59e0b',
    Shortlisted: '#2563eb',
    Rejected: '#ef4444',
    Selected: '#22c55e',
  };

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `PlaceHub - Application Status Updated: ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Application Status Update</h2>
        <p style="color: #64748b;">Hi ${studentName},</p>
        <p style="color: #64748b;">Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been updated.</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 24px; font-weight: bold; color: ${statusColors[status] || '#64748b'};">${status}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">Log in to PlaceHub for more details.</p>
      </div>
    `,
  });
};

// Send password-reset OTP email
const sendPasswordResetOTP = async (email, otp) => {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'PlaceHub - Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Reset Your Password</h2>
        <p style="color: #64748b;">Use the OTP below to reset your PlaceHub account password. This code expires in 5 minutes.</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOTPEmail, sendStatusEmail, sendPasswordResetOTP };
