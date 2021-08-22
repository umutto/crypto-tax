import { Layout } from "../layouts";
import { Card, Dropzone } from "../components";

import styles from "../styles/home.module.scss";
import React from "react";

export default function Sync() {
  return (
    <Layout>
      <>
        <div className="pt-3">
          <p className="text-xl text-center">
            You can use a csv file, use the Binance API or sync your file cache with the
            DynamoDB.
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
              description="Add new transactions using API calls. Currently only Binance API is supported."
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
