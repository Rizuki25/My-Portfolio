import "../css/style.css";
import "../css/dynamic-assets.css";

export const metadata = {
  title: "Fahzri Rizqie — Engineering Portfolio",
  description: "Fahzri Rizqie — engineering portfolio.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
