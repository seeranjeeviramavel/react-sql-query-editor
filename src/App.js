import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import QueryHistory from "./components/QueryHistory";
import SqlEditor from "./components/SqlEditor";
import Table from "./components/Table";
import DataDraw from "./components/TableDrawer/DataDraw";
import {
  setQuery,
  setValue,
  setDefaults,
  setHeaders,
  setRows,
  setCSVData,
  setQueryHistory,
} from "./slices/querySlice";
import data from "./DataStore/data.json";

function App() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.query.query);
  const value = useSelector((state) => state.query.value);
  const headers = useSelector((state) => state.query.headers);
  const rows = useSelector((state) => state.query.rows);
  const defaults = useSelector((state) => state.query.defaults);
  const csvData = useSelector((state) => state.query.csvData);
  const queryHistory = useSelector((state) => state.query.queryHistory);
  const tableNames = Object.keys(data);

  let tableHeaders = [];
  let tableRows = [];

  if (defaults > 0 && defaults <= tableNames.length) {
    tableHeaders = data[tableNames[defaults - 1]].headers;
    tableRows = data[tableNames[defaults - 1]].data;
  }

  useEffect(() => {
    if (value === "") {
      toast.error("Please remove the code and run the query");
    }
  }, [value]);

  const runQuery = () => {
    dispatch(setQuery(value));
    dispatch(setQueryHistory(value));

    const regex = /\bfrom\s+(\w+)\b/i;
    const match = value.match(regex);
    const extractedTableName = match ? match[1].toLowerCase() : null;

    if (tableNames.some((name) => name.toLowerCase() === extractedTableName)) {
      const selectedTable = data[extractedTableName];
      const allHeaders = selectedTable.headers;
      const allRows = selectedTable.data;

      const columnRegex = /\bselect\s+(.+)\s+from\b/i;
      const columnMatch = value.match(columnRegex);
      const columns = columnMatch
        ? columnMatch[1].split(",").map((col) => col.trim())
        : ["*"];

      if (columns.includes("*")) {
        dispatch(setHeaders(allHeaders));
        dispatch(setRows(allRows));
      } else {
        const filteredHeaders = allHeaders.filter((header) =>
          columns.includes(header.field)
        );
        const filteredRows = allRows.map((row) => {
          let newRow = {};
          filteredHeaders.forEach((header) => {
            newRow[header.field] = row[header.field];
          });
          return newRow;
        });

        dispatch(setHeaders(filteredHeaders));
        dispatch(setRows(filteredRows));
      }
    } else {
      dispatch(setHeaders([]));
      dispatch(setRows([]));
    }
  };

  const reset = () => {
    dispatch(setQuery(""));
    dispatch(setValue("select * from customers;"));
    dispatch(setDefaults(1));
    dispatch(setHeaders([]));
    dispatch(setRows([]));
    dispatch(setCSVData([]));
  };
  return (
    <div className="flex flex-wrap justify-center items-start w-full">

      <div className="w-full lg:w-3/12">
        <DataDraw />
      </div>
      <div className="w-full lg:w-9/12">
        <div className="flex flex-wrap justify-center items-start w-full">
          <div className="w-full lg:w-9/12">
            <div className="flex w-full justify-between " ></div>
            <SqlEditor
              value={value}
              setValue={(val) => dispatch(setValue(val))}
            />
            <div className="flex justify-end">
              <div className="p-2">
                <button
                  onClick={reset}
                  className="flex mx-auto text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded text-sm justify-center items-center"
                >
                  <div className="font-semibold">Clear</div>
                </button>
              </div>
              <div className="p-2">
                <button
                  onClick={runQuery}
                  className="flex mx-auto text-white bg-blue-500 border-0 py-2 px-4 focus:outline-none hover:bg-blue-600 rounded text-sm justify-center items-center"
                >
                  <div className="font-semibold">Execute</div>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-3/12">
            <QueryHistory />
          </div>
        </div>
        <Table query={query} headers={headers} rows={rows} csvData={csvData} />
      </div>
      <Toaster
        position="bottom-left"
        gutter={8}
        toastOptions={{
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;
