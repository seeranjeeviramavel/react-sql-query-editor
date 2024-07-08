import React from "react";
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

function Table() {
  const query = useSelector((state) => state.query.query);
  const headers = useSelector((state) => state.query.headers);
  const rows = useSelector((state) => state.query.rows);

  const csvData = rows.map((row) => {
    let csvRow = {};
    headers.forEach((header) => {
      csvRow[header.field] = row[header.field];
    });
    return csvRow;
  });

  const downloadJSON = () => {
    const jsonData = JSON.stringify(rows, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${new Date().getTime().toString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {query ? (
        <section className="text-gray-600 body-font pl-4">
          <div className="flex w-full  mt-6 lg:mt-0">
            <div className="font-bold text-center py-3 w-40">
              Output / Result :
            </div>
            <div className="p-2 flex">
              <CSVLink
                data={csvData}
                headers={headers.map((header) => ({
                  label: header.headerName,
                  key: header.field,
                }))}
                filename={`${new Date().getTime().toString()}.csv`}
                className="mr-2"
              >
                <button className="flex items-center text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded text-sm">
                  <i class="fa-solid fa-file-arrow-down"></i>
                  <span className="pl-2 font-semibold">Export CSV</span>
                </button>
              </CSVLink>

              <button
                onClick={downloadJSON}
                className="flex items-center text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded text-sm"
              >
                <i class="fa-solid fa-file-arrow-down"></i>
                <span className="pl-2 font-semibold">Export JSON</span>
              </button>
            </div>
          </div>
          {headers.length > 0 && rows.length > 0 && (
            <div className="ag-theme-quartz" style={{ height: 350 }}>
              <AgGridReact
                rowData={rows}
                columnDefs={headers}
                defaultColDef={{ flex: 1 }}
              />
            </div>
          )}
          {headers.length === 0 && rows.length === 0 && (
            <div className="w-full flex text-center h-80 justify-center items-center font-bold text-gray-400 text-2xl px-6">
              No data found
            </div>
          )}
        </section>
      ) : (
        <div className="w-full flex text-center h-80 justify-center items-center font-bold text-gray-400 text-2xl px-6">
          Run Something & Your Output Shall Appear!
        </div>
      )}
    </div>
  );
}

export default Table;
