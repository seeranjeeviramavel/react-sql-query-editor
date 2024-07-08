import React from "react";
import TableStructure from "./TableStructure";
import data from "../../DataStore/data.json";

function DataDraw() {
  const tableNames = Object.keys(data);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="font-bold text-center text-lg text-blue-500 py-2">Tables</div>
      <div className="w-8/12 border-b-2 mx-auto mb-4"></div>
      <div className="overflow-auto h-full">
        {tableNames.map((tableName, index) => (
          <React.Fragment key={index}>
            <TableStructure
              tableHead={data[tableName].headers}
              tableName={tableName}
              tableNo={index + 1}
            />
            {index < tableNames.length - 1 && (
              <div className="w-8/12 border-b-2 mx-auto my-8"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default DataDraw;
