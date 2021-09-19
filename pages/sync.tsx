import dynamic from "next/dynamic";

import { Loader } from "../components";

const Layout = dynamic(() => import("../layouts/Layout"), { loading: Loader });
const Card = dynamic(() => import("../components/Card"), { loading: Loader });
const Dropzone = dynamic(() => import("../components/Dropzone"), { loading: Loader });

import styles from "../styles/home.module.scss";
import React from "react";

export default function Sync() {
  return (
    <Layout background="connect">
      <>
        <div className="pt-3">
          <p className="text-xl text-center dark:text-white mb-5 text-shadow-crypto">
            You can upload a <span className="text-pink-500 font-bold">csv</span> file or
            use the Binance <span className="text-pink-500 font-bold">API</span> to
            register new transactions on database.
            <br />
            Or <span className="text-pink-500 font-bold">sync</span> your file cache from
            database.
          </p>

          <div className={styles.grid + " " + styles.full}>
            <Card
              title="CSV"
              description="Add new transactions using a .csv file. Koinly template is used for the csv structure."
            >
              <Dropzone></Dropzone>
            </Card>

            <Card
              title="API [*WIP]"
              description="Add new transactions using API calls. Currently, only works with Binance API."
              className={styles.disabled}
            ></Card>

            <Card
              title="Update"
              description="Update local file cache from DynamoDB."
            ></Card>
          </div>
        </div>
      </>
    </Layout>
  );
}
