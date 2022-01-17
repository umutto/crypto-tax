import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { totalAverage } from "../lib";
import { parseCsv } from "../model";
import { getYearlyStats } from "../utils";
import { toast, Zoom } from "react-toastify";

export default function Dropzone() {
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
    onDrop: useCallback((acceptedFiles) => {
      const promiseToast = toast.loading("Parsing CSV", {
        position: toast.POSITION.BOTTOM_CENTER,
      });

      parseCsv(acceptedFiles, (rows) => {
        dataRef.current = rows;
        setRowCount(rows.length);

        // temporarily print the results to console
        const yearlySummary = totalAverage(rows);
        const yearlyStats = getYearlyStats(rows);
        console.log("Yearly Transaction Summary Per Coin:");
        console.log(yearlySummary);
        console.log("Yearly Transaction Stats:");
        console.log(yearlyStats);
        // temporarily print the results to console

        toast.update(promiseToast, {
          render: `Parsed ${rows.length} rows!`,
          type: "info",
          isLoading: false,
          transition: Zoom,
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          position: toast.POSITION.BOTTOM_CENTER,
          closeButton: null,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
        });
      });
    }, []),
  });

  const files =
    acceptedFiles && acceptedFiles.length > 0 ? (
      <div>
        {acceptedFiles.map((file) => (
          <p key={file.name}>
            {file.name} - {file.size} bytes.
          </p>
        ))}
        <p>
          Found <strong>{rowCount}</strong> total rows.
        </p>
      </div>
    ) : null;

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
      </div>
    </section>
  );
}
