import './globals.css'  // ← ROOT globals.css (NOT manual/globals.css)

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

