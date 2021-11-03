import Link from "next/link";

import styles from "../styles/404.module.scss";

export default function Custom404() {
  return (
    <div className="flex flex-col text-center items-center justify-center h-screen bg-white dark:bg-black text-dark dark:text-white">
      <div className="flex items-center justify-center">
        <h1 className="inline-block font-bold text-2xl md:text-4xl gray-500 border-r border-gray-300 mr-2 pr-2">
          404
        </h1>
        <div
          className={"inline-block font-mono text-md md:text-xl " + styles["text-cray"]}
        >
          <h2>This page could not be found.</h2>
        </div>
      </div>
      <div>
        <span>Return to </span>
        <Link href="/">
          <a className="text-blue-500 font-bold">index</a>
        </Link>
        .
      </div>
    </div>
  );
}
