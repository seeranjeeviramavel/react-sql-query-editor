import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../slices/querySlice";


function TableStructure({ tableName, tableHead }) {
  const dispatch = useDispatch();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const queryHistory = useSelector((state) => state.query.queryHistory);

  const handleColumnClick = (column) => {
    const newSelectedColumns = [...selectedColumns];
    if (!newSelectedColumns.includes(column)) {
      newSelectedColumns.push(column);
    }
    setSelectedColumns(newSelectedColumns);
    let columnsString = newSelectedColumns.join(", ");
    const query = `SELECT ${columnsString} FROM ${tableName}`;
    dispatch(setValue(query));
  };

  const handleTableClick = () => {
    setSelectedColumns([]);
    const query = `SELECT * FROM ${tableName}`;
    dispatch(setValue(query));
  };

  return (
    <div className="mx-10">
      <div className="flex items-center cursor-pointer">
      <i class="fa-solid fa-table-columns fa-lg text-gray-500"></i>
        <p
          className="font-bold text-lg ml-3 text-gray-500"
          style={{ cursor: "pointer" }}
          onClick={() => handleTableClick()}
        >
          {tableName} [+]
        </p>
      </div>
      {tableHead.map((row, index) => (
        <div
          className="flex items-end relative ml-3"
          key={index}
          style={{ cursor: "pointer" }}
          onClick={() => handleColumnClick(row.field)}
        >
          <div className="w-6 h-8 border-l-2 border-b-2"></div>
          <p className=" text-gray-500 text-sm font-semibold">
            {row.field}
            <span className="text-blue-300 hover:text-blue-400">
              {" "}
              [{row.type}({row.fieldSize})]
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}

export default TableStructure;
