import type { QRCodeRequest } from '@app-types/qr';

const qrCodeForm = document.querySelector<HTMLFormElement>('#qr-code-form');
const qrCodeResult = document.querySelector<HTMLDivElement>('#qr-code-result');
const qrCodeError = document.querySelector<HTMLParagraphElement>('#qr-code-error');
const urlInput = document.querySelector<HTMLInputElement>('#url');

if (!qrCodeForm || !qrCodeResult || !qrCodeError || !urlInput) {
  throw new Error('QR Code form elements not found');
}

const showError = (message: string) => {
  qrCodeError.textContent = message;
  qrCodeError.classList.remove('hidden');
};

const clearError = () => {
  qrCodeError.textContent = '';
  qrCodeError.classList.add('hidden');
};

const renderQrCode = (svg: string, url: string) => {
  // Render the SVG via an <img> data URI rather than innerHTML: browsers do not
  // execute scripts in images, and `alt` provides screen-reader text.
  const image = document.createElement('img');
  image.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  image.alt = `QR code for ${url}`;
  image.className = 'h-full w-full';
  qrCodeResult.replaceChildren(image);
};

qrCodeForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();

  let url: URL;
  try {
    url = new URL(urlInput.value);
  } catch {
    showError('Please enter a valid URL, including http:// or https://.');
    return;
  }

  const payload: QRCodeRequest = {
    url: url.toString(),
    color: { dark: '#FFFFFF', light: '#2B2B2B' },
  };

  try {
    const response = await fetch('/api/qr/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const svg = await response.text();
    renderQrCode(svg, url.toString());
  } catch (err) {
    console.error(err);
    showError('Could not generate the QR code. Please try again.');
  }
});
