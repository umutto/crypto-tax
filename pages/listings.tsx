import { Card } from "../components/index";

import styles from "../styles/home.module.css";

export function Listings() {
  return (
    <div className="pt-3">
      <p className={styles.description}>Here are your tracked currencies.</p>

      <div className={styles.grid}>
        <Card
          title="Documentation &rarr;"
          description="Find in-depth information about Next.js features and API."
        ></Card>

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
          <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
        </a>
      </div>
    </div>
  );
}
