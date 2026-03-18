// ========== Cloudflare Worker - CORS Proxy ==========
// Prosljeđuje zahtjeve na Google Apps Script i dodaje CORS headere
// Deploy: cloudflare.com → Workers & Pages → Create Worker → paste → Deploy

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyfAJJ-8rmOKcUKPLT3-yvV1V5DIYDL4M_hp6bcDDpXCdfzRc_LAUoGlz8zr6CPfa88/exec';

const ALLOWED_ORIGINS = [
  'https://sumarijabosanskipetrovac-cloud.github.io',
  'https://pogonboskrupa.github.io',
  'https://www.sumarijaboskrupa.work',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const origin = request.headers.get('Origin');
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  // OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Test endpoint: ?test=true
  const reqUrl = new URL(request.url);
  if (reqUrl.searchParams.get('test') === 'true') {
    return new Response(JSON.stringify({
      success: true,
      message: 'Cloudflare Worker radi!',
      timestamp: new Date().toISOString(),
      target: APPS_SCRIPT_URL
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const appsScriptUrl = APPS_SCRIPT_URL + reqUrl.search;

    const response = await fetch(new Request(appsScriptUrl, {
      method: request.method,
      headers: { 'Content-Type': 'application/json' },
      body: request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.text()
        : undefined
    }));

    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Proxy error: ' + error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
