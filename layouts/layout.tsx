import React, { FC, ReactNode } from "react";
import Head from "next/head";

import { Loader, Navbar } from "../components";
import { Footer } from "../components";
import { useSession } from "next-auth/client";

export default function Layout({ children }: { children: ReactNode }) {
  const [session, loading] = useSession();

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Head>
            <title>Personal Crypto Tax Calculator</title>
            <meta name="description" content="Personal Crypto Tax Calculator" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
          </Head>
          <div className="min-h-screen flex flex-col items-center">
            {session && <Navbar></Navbar>}
            <main className="flex flex-1 flex-col justify-center items-center">
              {children}
            </main>
            <Footer></Footer>
          </div>
        </>
      )}
    </>
  );
}
