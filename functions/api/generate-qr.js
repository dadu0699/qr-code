import QRCode from 'qrcode';

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
    },
  });

  return new Response(JSON.stringify({ svg: qrImage }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
