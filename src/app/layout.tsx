import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Already Spilled",
  description: "A knight in shining armor has not seen battle. Embrace the mess.",
  keywords: ["Already Spilled", "clothing", "collectibles", "beans"],
  openGraph: {
    title: "Already Spilled",
    description: "Embrace the mess.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Anton&family=Bebas+Neue&family=Cabin+Sketch:wght@700&family=Courier+Prime:wght@700&family=Dela+Gothic+One&family=Luckiest+Guy&family=Oswald:wght@700&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Rubik+Mono+One&family=Special+Elite&family=Ultra&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
