import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import { Loader } from "../components";
import { useSession } from "next-auth/client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = dynamic(() => import("../components/Navbar"), { loading: Loader });
const Footer = dynamic(() => import("../components/Footer"), { loading: Loader });

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
        <>
          <Head>
            <title>Personal Crypto Tax Calculator</title>
            <meta name="description" content="Personal Crypto Tax Calculator" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3f3d56" />
            <meta name="msapplication-TileColor" content="#3f3d56" />
            <meta name="theme-color" content="#3f3d56" />
          </Head>
          <div className="bg-white dark:bg-gray-900 ">
            <div className="main-wrapper min-h-screen flex flex-col items-center bg-gradient-radial from-grad-light dark:from-grad-dark animate-subtle md:animate-none">
              {_background &&
                _background.length > 0 &&
                _background.map((b, i) => (
                  <div key={i} className={`static-bg bg-${b}`}>
                    <div>
                      <Image
                        alt={b}
                        src={bg[b]}
                        layout="fill"
                        objectFit="contain"
                        quality={100}
                        priority={true}
                      />
                    </div>
                  </div>
                ))}
              {session && <Navbar></Navbar>}
              <main className="flex flex-1 flex-col w-full justify-center items-center z-1">
                {children}
              </main>
              <Footer></Footer>
            </div>
            <ToastContainer />
          </div>
        </>
      )}
    </>
  );
}
