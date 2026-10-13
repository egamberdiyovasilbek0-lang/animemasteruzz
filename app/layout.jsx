import "./globals.css";

export const metadata = {
  title: "AnimeMaster UZ",
  description: "Anime tarjimalari va Uzbek dubbing platformasi"
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
