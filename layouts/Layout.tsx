import React, { ReactNode, useEffect } from "react";
import Head from "next/head";

import { Loader, Navbar } from "../components";
import { Footer } from "../components";
import { useSession } from "next-auth/client";

import Image from "next/image";

export type BackgroundType = "moon" | "rocket" | "connect" | "adventure" | "stats";

export default function Layout({
  children,
  background,
}: {
  children: ReactNode;
  background?: Array<BackgroundType> | BackgroundType;
}) {
  const [session, loading] = useSession();
  const bg = {
    moon: "/images/undraw_moonlight_5ksn.svg",
    rocket: "/images/undraw_upgrade_06a0.svg",
    connect: "/images/undraw_server_status_5pbv.svg",
    adventure: "/images/undraw_adventure_map_hnin.svg",
    stats: "/images/undraw_visual_data_re_mxxo.svg",
  };
  const _background = background
    ? Array.isArray(background)
      ? background
      : [background]
    : undefined;

  useEffect(() => {
    if (
      localStorage.theme === "light" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: light)").matches)
    ) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  });

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white dark:bg-gray-900 ">
          <Head>
            <title>Personal Crypto Tax Calculator</title>
            <meta name="description" content="Personal Crypto Tax Calculator" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
          </Head>
          <div className="main-wrapper min-h-screen flex flex-col items-center bg-gradient-radial from-grad-light dark:from-grad-dark animate-subtle md:animate-none">
            {_background &&
              _background.length > 0 &&
              _background.map((b, i) => (
                <div key={i} className={`static-bg bg-${b}`}>
                  <Image
                    alt={b}
                    src={bg[b]}
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                  />
                </div>
              ))}
            {session && <Navbar></Navbar>}
            <main className="flex flex-1 flex-col w-full justify-center items-center z-1">
              {children}
            </main>
            <Footer></Footer>
          </div>
        </div>
      )}
    </>
  );
}
