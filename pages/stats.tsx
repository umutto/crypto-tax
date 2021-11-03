import dynamic from "next/dynamic";

import { Loader } from "../components";
import { rc, YearStatsLocale } from "../lib";

const Layout = dynamic(() => import("../layouts/Layout"), { loading: Loader });
const Card = dynamic(() => import("../components/Card"), { loading: Loader });

import styles from "../styles/home.module.scss";
import { getYearlyStats } from "../utils";

const statsToString = (stats: YearStatsLocale) => {
  return (
    <>
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className={styles.stats}>
          <strong>{key}</strong>:
          <span
            className={
              rc(value) > 0 ? "text-green-500" : rc(value) < 0 ? "text-red-500" : ""
            }
          >
            {value}
          </span>
        </div>
      ))}
    </>
  );
};

export default function Stats() {
  return (
    <Layout background="stats">
      <div className="pt-3">
        <p className="text-2xl dark:text-white text-center mb-5 text-shadow-crypto">
          Yearly Statistics
        </p>

        <div className={styles.grid}>
          {Object.entries(getYearlyStats()).map(([year, stats], i) => (
            <Card
              key={i}
              title={`${parseInt(year)} - ${parseInt(year)}`}
              description={statsToString(stats)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
