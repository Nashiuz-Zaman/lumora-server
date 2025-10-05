import {
  getEmailWrapperStart,
  emailWrapperEnd,
  getEmailHeader,
  getEmailFooter,
} from "./commonEmailParts";

export const getVerificationEmailHtml = (
  verificationLink: string,
  year: number
) => {
  return `
${getEmailWrapperStart("Verify Your Email")}

${getEmailHeader("Discover gadgets, fashion, food & more — all in one place.")}

<!-- Body -->
<tr>
  <td style="padding:30px; color:#374151; font-size:16px; line-height:1.5;">
    <p style="margin:0 0 10px 0;">Hi there,</p>
    <p style="margin:0 0 20px 0;">
      Thank you for signing up with <strong>Lumora</strong>. Please verify your email address by
      clicking the button below:
    </p>

    <!-- Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:35px auto;">
      <tr>
        <td align="center" bgcolor="#a855f7" style="border-radius:9999px;">
          <a
            href="${verificationLink}"
            target="_blank"
            style="display:inline-block; padding:14px 32px; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; background-color:#a855f7; border-radius:9999px;"
          >
            Verify Email
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:30px 0 0 0; font-size:14px; color:#6b7280; text-align:center;">
      This is an automated email. If you didn’t create an account, you can safely ignore this message.
    </p>
  </td>
</tr>

${getEmailFooter(year)}

${emailWrapperEnd}
  `;
};
