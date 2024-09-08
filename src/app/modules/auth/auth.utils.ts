import config from '../../config';
import sendMail from '../../utils/mail';

export const sendPasswordResetMail = async (
  email: string,
  resetLink: string,
) => {
  const html = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Email</title>
        <style> 
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 20px;
            }
            .footer {
                text-align: center;
            }

            button {
                border: 2px solid #24b4fb;
                background-color: #24b4fb;
                border-radius: 0.9em;
                padding: 0.8em 1.2em 0.8em 1em;
                transition: all ease-in-out 0.2s;
                font-size: 16px;
                color: #fff;
            }

            button:hover {
                background-color: #0071e2;
            }

            a {
                color: #fff;
                text-decoration: none;
            }
            
            @media only screen and (max-width: 600px) {
                .container {
                    padding: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset From ${config.app_name}</h1>
            </div>
            <div class="content">
                <p>You recently requested a password reset for your account in ${config.app_name}.</p>
                <p>To reset your password, please click on the link below within 5minute:</p>
                <a href=${resetLink}>
                <button>
                    Reset Password
                </button>
                </a>
                <p>If you didn't request a password reset, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>Best Regards,</p>
                <p>${config.app_name}</p>
            </div>
        </div>
    </body>
</html>`;

  await sendMail({
    sendTo: email,
    subject: 'Password reset',
    body: html,
  });
};
