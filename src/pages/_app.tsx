// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionProvider } from "next-auth/react";
import Header from '../components/ui/Header'; // Import the Header
import Footer from '../components/ui/Footer'; // Import the Footer

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header /> {/* Add the Header component here */}
      {/* Add padding-top to prevent content overlap */}
      <main className="pt-16"> {/* Adjust 16 to match your header height */}
        <Component {...pageProps} />
      </main>
      <Footer /> {/* Add the Footer component here */}
    </SessionProvider>
  );
}

export default MyApp;