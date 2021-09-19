import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { totalAverage, transactionStats } from "../lib";
import { parseCsv } from "../model";

export function Dropzone() {
  const [rowCount, setRowCount] = useState(0);
  let dataRef = useRef({});

  const {
    acceptedFiles,
    isFileDialogActive,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ".csv",
    maxFiles: 1,
    onDrop: useCallback((acceptedFiles) => {
      parseCsv(acceptedFiles[0], (rows) => {
        dataRef.current = rows;
        setRowCount(rows.length);

        // temporarily print the results to console
        const summary = totalAverage(rows);
        const stats = transactionStats(summary);
        console.log("Transaction Summary Per Coin:");
        console.log(summary);
        console.log("Transaction Stats:");
        console.log(stats);
        // temporarily print the results to console
      });
    }, []),
  });

  const files = acceptedFiles.map((file) => (
    <span key={file.name}>
      {file.name} - {file.size} bytes.
      <span>
        <br />
        Found <strong>{rowCount}</strong> rows.
      </span>
    </span>
  ));

  const handleClick = () => {
    console.log(dataRef.current);
    // @TODO: send the data to the server
  };

  return (
    <section className="container p-5">
      <div
        {...getRootProps({
          className:
            "flex flex-col items-center p-5 border-2 border-dashed bg-yellow-50 cursor-pointer hover:border-blue-200 " +
            (() => {
              if (isDragActive && isDragReject) return "border-red-300";
              else if (isDragActive && isDragAccept) return "border-green-300";
              else if (isDragActive || isFileDialogActive || acceptedFiles.length > 0)
                "border-blue-200 bg-blue-50";
              else return "border-yellow-200";
            })(),
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-black">Drop the files here ...</p>
        ) : (
          <p className="text-black">
            Drag &#39;n&#39; drop some files here, or click to select files
          </p>
        )}
        <em className="text-xs text-black">(Only *.csv files will be accepted)</em>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-3 items-center align-center justify-center">
        <aside className="flex">
          <div className="text-center">{files}</div>
        </aside>
        {rowCount > 0 ? (
          <div className="flex align-center justify-center">
            <button
              onClick={handleClick}
              className="bg-blue-500 hover:bg-white hover:text-blue-500 text-white border-blue-500 border-2 dark:border-gray-900 dark:bg-gray-900 dark:hover:bg-white dark:hover:text-gray-900 font-bold py-2 px-4 rounded p-2"
            >
              <FontAwesomeIcon icon={["fas", "sync-alt"]} fixedWidth className="mr-2" />
              Sync to Database
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
