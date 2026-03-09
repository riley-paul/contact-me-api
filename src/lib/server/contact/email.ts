import type { CreateEmailOptions } from "resend";
import escapeHtml from "escape-html";
import type { ContactFormData } from "@/lib/types";
import { z } from "astro/zod";

type GetEmailArgs = {
  contactData: ContactFormData;
  projectEmails: string[];
  projectName: string;
};

export const getProjectEmails = (emails: string): string[] => {
  const { data = [] } = z.array(z.string().email()).safeParse(
    emails
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  );
  return data;
};

export const getEmail = ({
  contactData: { name, email, message },
  projectEmails,
  projectName,
}: GetEmailArgs): CreateEmailOptions => {
  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message);
  const escapedProjectName = escapeHtml(projectName);

  return {
    from: "Contactulator <contactulator@notifications.rileys-projects.com>",
    to: projectEmails,
    replyTo: email, // Allow project owners to reply directly
    subject: `New message from ${name} via Contactulator`,
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Contact Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
<h1 style="color: white; margin: 0; font-size: 24px;">📬 New Contact Message</h1>
</div>

<div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
<div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
<p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>From:</strong></p>
<p style="margin: 0 0 20px 0; font-size: 16px;">${escapedName}</p>

<p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>Email:</strong></p>
<p style="margin: 0 0 20px 0;"><a href="mailto:${escapedEmail}" style="color: #667eea; text-decoration: none;">${escapedEmail}</a></p>

<p style="margin: 0 0 10px 0; color: #666; font-size: 14px;"><strong>Message:</strong></p>
<div style="background: #f5f5f5; padding: 15px; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word;">${escapedMessage}</div>
</div>

<div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
<p style="margin: 0; color: #666; font-size: 14px;"><strong>Project:</strong> ${escapedProjectName}</p>
</div>

<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">

<p style="text-align: center; color: #999; font-size: 12px; margin: 0;">
This email was sent via <a href="https://contactulator.rileys-projects.com" style="color: #667eea; text-decoration: none;">Contactulator</a>
</p>
</div>
</body>
</html>
  `,
  };
};
