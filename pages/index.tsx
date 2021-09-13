import { useSession } from "next-auth/client";

import { Layout } from "../layouts";
import { AuthScreen, Card, Welcome } from "../components";

import { formatDistance } from "date-fns";

import styles from "../styles/home.module.scss";

export default function Home() {
  const [session] = useSession();

  return (
    <Layout background={session ? "adventure" : "moon"}>
      <>
        <Welcome user={session?.user}></Welcome>
        {!session && <AuthScreen></AuthScreen>}
        {session && (
          <div className="pt-3">
            <p className="text-xl text-center dark:text-white mb-5">
              You have made <span className="font-bold text-green-500">{100}</span>{" "}
              transactions this year. Your last sync was{" "}
              <span className="font-bold text-pink-500">
                {formatDistance(new Date(2021, 1, 1), new Date(), {
                  addSuffix: true,
                  includeSeconds: true,
                })}
              </span>
              .
            </p>
            <div className={styles.grid}>
              <Card
                title="Portfolio &rarr;"
                description="Take a look at your portfolio. Not live tracking though, just a friendly reminder of what you have."
                URL="/portfolio"
                icon={{ icon: ["fas", "coins"] }}
              ></Card>
              <Card
                title="Tax Report &rarr;"
                description="Calculate the miscellaneous income tax for Japan."
                URL="/tax"
                icon={{ icon: ["fas", "file-signature"] }}
              ></Card>
              <Card
                title="Stats &rarr;"
                description="Take a look at some simple stats."
                URL="/stats"
                icon={{ icon: ["fas", "chart-bar"] }}
              ></Card>
              <Card
                title="Sync &rarr;"
                description="Sync your transaction data using a csv or API calls."
                URL="/sync"
                icon={{ icon: ["fas", "sync-alt"] }}
              ></Card>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
}

Home.skipAuth = true;
