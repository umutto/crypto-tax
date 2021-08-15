import React from "react";
import { useDropzone } from "react-dropzone";
import { Layout } from "../layouts";
import { Card } from "../components";

import styles from "../styles/home.module.scss";

function Dropzone() {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    maxFiles: 1,
  });

  const files = acceptedFiles.map((file) => (
    <span key={file.name}>
      <span className="font-bold">File: </span>
      {file.name} - {file.size} bytes
    </span>
  ));

  return (
    <section className="container p-5">
      <div
        {...getRootProps({
          className:
            "flex flex-col items-center p-5 border-2 border-yellow-200 border-dashed bg-yellow-50 cursor-pointer hover:border-blue-200",
        })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em className="text-xs">(Only *.csv files will be accepted)</em>
      </div>
      <aside>
        <div className="text-center">{files}</div>
      </aside>
    </section>
  );
}

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
              title="API"
              description="Add new transactions using API calls. Currently only Binance API is supported."
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
