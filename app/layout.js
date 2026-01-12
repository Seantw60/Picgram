import './globals.css';
export const metadata = {
  title: 'Picgram - AI Image Sharing',
  description: 'Generate AI images with DALL·E 2 and share them',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}