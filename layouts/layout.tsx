import React, { FC, ReactNode, useEffect } from "react";
import Head from "next/head";

import { Loader, Navbar } from "../components";
import { Footer } from "../components";
import { useSession } from "next-auth/client";

import styles from "../styles/home.module.scss";

export default function Layout({ children }: { children: ReactNode }) {
  const [session, loading] = useSession();

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }

    // localStorage.theme = "light";
    // localStorage.theme = "dark";
    // localStorage.removeItem("theme");
  });

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
          <div
            className={
              styles["bg-moon"] +
              " min-h-screen flex flex-col items-center bg-white dark:bg-gray-900"
            }
            style={{
              backgroundImage: "url(/images/undraw_moonlight_5ksn.svg)",
            }}
          >
            {session && <Navbar></Navbar>}
            <main className="flex flex-1 flex-col w-full justify-center items-center">
              {children}
            </main>
            <Footer></Footer>
          </div>
        </>
      )}
    </>
  );
}
