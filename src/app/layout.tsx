import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "SpreeDesk — Your place to work awaits in Berlin",
  description:
    "On-demand desks, meeting rooms and memberships across Berlin's best coworking spaces. One pass, any location.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Navbar
            user={user ? { name: user.name, role: user.role, email: user.email } : null}
          />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
