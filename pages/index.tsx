import { useSession } from "next-auth/client";

import { Layout } from "../layouts";
import { AuthScreen, Card, Welcome } from "../components";

import styles from "../styles/home.module.scss";

export default function Home() {
  const [session] = useSession();

  return (
    <Layout>
      <>
        <Welcome user={session?.user}></Welcome>
        {!session && <AuthScreen></AuthScreen>}
        {session && (
          <div className="pt-3">
            <p className="text-xl text-center">
              You have made <span className="font-bold text-green-500">{100}</span>{" "}
              transactions this year. Your last sync was on{" "}
              <span className="font-bold text-pink-500">
                {new Date().toLocaleDateString()}
              </span>
              .
            </p>
            <div className={styles.grid}>
              <Card
                title="Portfolio &rarr;"
                description="Take a look at your portfolio. Not live tracking though, just a friendly reminder of what you have."
                URL="/portfolio"
              ></Card>
              <Card
                title="Tax Report &rarr;"
                description="Calculate the miscellaneous income tax for Japan."
                URL="/tax"
              ></Card>
              <Card
                title="Stats &rarr;"
                description="Take a look at some simple stats."
                URL="/stats"
              ></Card>
              <Card
                title="Sync &rarr;"
                description="Sync your transaction data using a csv or API calls."
                URL="/sync"
              ></Card>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
}

Home.skipAuth = true;
