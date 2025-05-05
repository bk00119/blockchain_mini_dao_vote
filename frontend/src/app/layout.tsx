import "./globals.css";
import { Web3Provider } from "@/components/web3-provider";

export const metadata = {
  title: "Mini DAO Vote",
  description: "Mini DAO Voting App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex justify-center max-w-screen">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
