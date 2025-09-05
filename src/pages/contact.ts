import { createDb } from "@/db";
import { Project, ProjectEmails } from "@/db/schema";
import { createResend } from "@/lib/server/resend";
import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { eq, or } from "drizzle-orm";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(100),
  message: z.string().min(1).max(1000),
  projectId: z.string(),
  redirectUrl: z.string().url().optional(),
});

export const POST: APIRoute = async ({ request, locals }) => {
  const db = createDb(locals.runtime.env);
  const resend = createResend(locals.runtime.env);

  const formData = await request.formData();
  const parsedData = formSchema.safeParse(Object.fromEntries(formData));

  if (!parsedData.success) {
    return new Response("Invalid form data", { status: 400 });
  }

  const { name, email, message, projectId, redirectUrl } = parsedData.data;

  const [project] = await db
    .select()
    .from(Project)
    .where(or(eq(Project.identifier, projectId), eq(Project.id, projectId)));

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  const projectEmails = await db
    .select()
    .from(ProjectEmails)
    .where(eq(ProjectEmails.projectId, project.id))
    .then((rows) => rows.map((r) => r.email));

  const emailResponse = await resend.emails.send({
    from: "Contactulator API <contactulator.api@gmail.com>",
    to: [...projectEmails, email],
    subject: `New message from ${name} via Contactulator`,
    html: `
      <p>You have a new message from ${name} (${email}):</p>
      <blockquote>${message}</blockquote>
      <p>Project: ${project.name}</p>
      <hr />
      <p>This email was sent via Contactulator.</p>
    `,
  });

  if (emailResponse.error) {
    return new Response(
      `Failed to send email: ${emailResponse.error.message}`,
      { status: 500 },
    );
  }

  if (redirectUrl) {
    return Response.redirect(redirectUrl, 303);
  }

  return new Response(
    JSON.stringify({ message: "Message sent successfully" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
