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
              Hope you have a <span className="font-bold text-green-500">green</span> day!
              If it's <span className="font-bold text-red-500">red</span>, just chill I
              guess.
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
                title="Re-sync &rarr;"
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
