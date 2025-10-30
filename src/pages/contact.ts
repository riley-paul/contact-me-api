import { createDb } from "@/db";
import { Message, Project, ProjectEmail } from "@/db/schema";
import { createResend } from "@/lib/server/resend";
import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { eq } from "drizzle-orm";

const formSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(100),
  message: z.string().min(1).max(1000),
  access_key: z.string(),
  redirect_url: z.string().url().optional(),
});

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const db = createDb(locals.runtime.env);
  const resend = createResend(locals.runtime.env);

  const formData = await request.formData();
  const parsedData = formSchema.safeParse(Object.fromEntries(formData));

  if (!parsedData.success) {
    return new Response("Invalid form data", { status: 400 });
  }

  const { name, email, message, access_key, redirect_url } = parsedData.data;

  const [project] = await db
    .select()
    .from(Project)
    .where(eq(Project.id, access_key));

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  await db.insert(Message).values({
    projectId: project.id,
    name,
    email,
    content: message,
  });

  const projectEmails = await db
    .select()
    .from(ProjectEmail)
    .where(eq(ProjectEmail.projectId, project.id))
    .then((rows) => rows.map((r) => r.email));

  const emailResponse = await resend.emails.send({
    from: "Contactulator <contaculator@notifications.rileys-projects.com>",
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

  if (redirect_url) {
    return Response.redirect(redirect_url, 303);
  }

  return redirect("/success");
};
