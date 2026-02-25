@"
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
"@ | Out-File -FilePath app/layout.js -Encoding UTF8
