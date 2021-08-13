import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CircleSvg from "../public/images/static_circle_load.svg";

export default function Home() {
  const [session, loading] = useSession();

  return (
    <>
      <Head>
        <title>Personal Crypto Tax Calculator</title>
        <meta name="description" content="Personal Crypto Tax Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          {loading ? (
            <>
              <div
                className="rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"
                style={{ borderTopColor: "#3498db" }}
              ></div>
              <p className="text-gray-500 pb-3 text-xl">Loading...</p>
            </>
          ) : (
            <>
              <h1 className={styles.title}>
                Welcome to{" "}
                <span className="text-blue-600 font-bold">Crypto Tax Calculator</span>
              </h1>
              {!session && (
                <>
                  <p className="text-gray-500 pt-10 pb-3 text-sm">
                    You are not signed in.
                  </p>
                  <button
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded shadow"
                    type="button"
                    onClick={() => signIn("google")}
                  >
                    <FontAwesomeIcon icon={["fab", "google"]} /> Sign in with Google
                  </button>
                </>
              )}
              {session && (
                <>
                  <p className={styles.description}>
                    Get started by editing{" "}
                    <code className={styles.code}>pages/index.js</code>
                  </p>

                  <div className={styles.grid}>
                    <a href="https://nextjs.org/docs" className={styles.card}>
                      <h2>Documentation &rarr;</h2>
                      <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                      <h2>Learn &rarr;</h2>
                      <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a
                      href="https://github.com/vercel/next.js/tree/master/examples"
                      className={styles.card}
                    >
                      <h2>Examples &rarr;</h2>
                      <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                      href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                      className={styles.card}
                    >
                      <h2>Deploy &rarr;</h2>
                      <p>
                        Instantly deploy your Next.js site to a public URL with Vercel.
                      </p>
                    </a>
                  </div>
                </>
              )}
            </>
          )}
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </div>
    </>
  );
}
