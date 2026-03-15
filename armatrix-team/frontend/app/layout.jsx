import "./globals.css";

export const metadata = {
  title: "Team — Armatrix",
  description:
    "Meet the builders behind Armatrix's inspection intelligence platform.",
  openGraph: {
    title: "Team — Armatrix",
    description: "The people building the future of industrial inspection.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
