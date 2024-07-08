import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setQuery,
  setValue,
  setDefaults,
  setHeaders,
  setRows,
  setCSVData,
} from "../slices/querySlice";

function QueryHistory() {
  const dispatch = useDispatch();
  const queryHistory = useSelector((state) => state.query.queryHistory);
  const globalDefaults = useSelector((state) => state.query.defaults);
  const [localDefaults, setLocalDefaults] = useState(globalDefaults);

  useEffect(() => {
    setLocalDefaults(globalDefaults);
  }, [globalDefaults]);

  const handleQueryClick = (item) => {
    dispatch(setDefaults(item.default));
    dispatch(setValue(item.query));
  };

  return (
    <div>
      <div className=" text-blue-500">
        <div className="w-full">
          <div className="font-bold text-lg text-center py-2">Query History</div>
          <div className="w-8/12 border-b-2 mx-auto mb-2"></div>
        </div>

        <div className="h-60 lg:h-55 overflow-auto scrollbar-hide mb-6 lg:mb-0 px-4">
          {queryHistory.map((item, index) => (
            <p
              key={index}
              className="cursor-pointer bg-gray-100 px-3 hover:bg-gray-400  hover:text-white p-2 text-center text-sm  rounded-lg my-4"
              onClick={() => handleQueryClick(item)}
            >
              {item.query}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QueryHistory;
