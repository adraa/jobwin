type PagesFunction = (context: any) => Response | Promise<Response>;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestOptions: PagesFunction = () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  const errorResponse = (message: string, status = 400) =>
    new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });

  let body: any;
  try {
    body = await request.json();
  } catch (err) {
    return errorResponse('Invalid JSON payload.');
  }

  const email = (body?.email || '').toString().trim();
  const code = (body?.code || 'JOBWIN10').toString().trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return errorResponse('A valid email is required.');
  }

  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.RESEND_FROM_EMAIL;

  if (!apiKey) {
    return errorResponse('RESEND_API_KEY is not configured.', 500);
  }
  if (!fromEmail) {
    return errorResponse('RESEND_FROM_EMAIL is not configured.', 500);
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h2 style="margin-bottom: 12px;">Your 10% off code</h2>
      <p style="margin: 8px 0 12px;">Apply this code at checkout to save 10% on the Interview Success Blueprint:</p>
      <div style="display:inline-block;padding:12px 16px;border:1px solid #E5E7EB;border-radius:10px;background:#F9FAFB;font-weight:700;letter-spacing:0.08em;">
        ${code}
      </div>
      <p style="margin-top:16px;">Need help? Just reply to this email.</p>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: 'Your 10% off code for the Interview Success Blueprint',
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unable to send email.');
    return errorResponse(text || 'Failed to send email.', 502);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });
};
