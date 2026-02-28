import { Geist, Geist_Mono } from "next/font/google";
import Chatbot from "@/components/Chatbot";
import LoginModal from "@/components/LoginModal";
import { UserProvider } from "@/context/UserContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "متجر عراق تك - للإلكترونيات الذكية",
  description: "أفضل الأجهزة التقنية في العراق",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <UserProvider>
          {children}
          <Chatbot />
          <LoginModal />
        </UserProvider>
      </body>
    </html>
  );
}
