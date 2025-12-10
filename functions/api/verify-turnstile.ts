export async function onRequest(context: any) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { 'content-type': 'application/json' } }
    );
  }

  const secret = env?.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return new Response(
      JSON.stringify({ success: false, error: 'Server missing TURNSTILE_SECRET_KEY' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }

  const payload = await request.json().catch(() => null);
  const token = payload?.token;

  if (!token) {
    return new Response(
      JSON.stringify({ success: false, error: 'Missing Turnstile token' }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    );
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  const clientIp = request.headers.get('CF-Connecting-IP');
  if (clientIp) {
    formData.append('remoteip', clientIp);
  }

  const verificationResponse = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: formData }
  );

  const verificationResult = await verificationResponse.json().catch(() => ({}));

  if (!verificationResponse.ok) {
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to reach Turnstile verification service.' }),
      { status: 502, headers: { 'content-type': 'application/json' } }
    );
  }

  const success = Boolean(verificationResult?.success);

  return new Response(
    JSON.stringify({
      success,
      action: verificationResult?.action,
      cdata: verificationResult?.cdata,
      'error-codes': verificationResult?.['error-codes'],
    }),
    {
      status: success ? 200 : 400,
      headers: { 'content-type': 'application/json' },
    }
  );
}

