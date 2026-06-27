/** Shared request contract for the QR generation endpoint (client + server). */
export interface QRColor {
  dark?: string;
  light?: string;
}

export interface QRCodeRequest {
  url: string;
  color?: QRColor;
}
