import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
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
        console.log(rows);
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
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        <em className="text-xs">(Only *.csv files will be accepted)</em>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-3 items-center align-center justify-center">
        <aside className="flex">
          <div className="text-center">{files}</div>
        </aside>
        {rowCount > 0 ? (
          <div className="flex align-center justify-center">
            <button
              onClick={handleClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded p-2"
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
