// import useSWR from "swr";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());
// const { data, error } = useSWR(
//   "https://api.github.com/repos/reactjs/react-a11y/issues?per_page=10&page=1",
//   fetcher
// );

// if (error) return "An error has occurred.";
// if (!data) return "Loading...";

import dynamic from "next/dynamic";

import { Loader } from "../components";

const Layout = dynamic(() => import("../layouts/Layout"), { loading: Loader });
const Card = dynamic(() => import("../components/Card"), { loading: Loader });

import styles from "../styles/home.module.scss";
import { getCoinCards } from "../utils";

export default function Portfolio() {
  return (
    <Layout background="rocket">
      <div className="pt-3">
        <p className="text-2xl dark:text-white text-center mb-5 text-shadow-crypto">
          Here are your tracked currencies.
        </p>

        <div className={styles.grid}>
          {getCoinCards().map((c, i) => (
            <Card
              key={i}
              title={`${c.name} (${c.ticker.toUpperCase()})`}
              description={c.description}
              URL={c.URL}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
