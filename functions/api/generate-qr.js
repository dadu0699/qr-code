import QRCode from 'qrcode';

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequestPost(context) {
  const { request } = context;
  const { url } = await request.json();

  const qrImage = await QRCode.toString(url, {
    type: 'svg',
    color: {
      dark: '#FFFFFF',
      light: '#3685FF',
    },
  });

  return new Response(qrImage, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
