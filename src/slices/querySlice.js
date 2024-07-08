import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';

const initialState = {
  query: "",
  value: Cookies.get("queryValue") ? Cookies.get("queryValue") : "SELECT * FROM customers;",
  defaults: 1,
  headers: [],
  rows: [],
  csvData: [],
  queryHistory: Cookies.get('queryHistory') ? JSON.parse(Cookies.get('queryHistory')) : [
    {
      query: "SELECT * FROM customers;",
      default: 1,
    },
    {
      query: "SELECT * FROM products;",
      default: 2,
    },
    {
      query: "SELECT * FROM suppliers;",
      default: 3,
    },
  ],
};

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
      Cookies.set('queryValue', action.payload, { expires: 365 });
    },
    setDefaults: (state, action) => {
      state.defaults = action.payload;
    },
    setHeaders: (state, action) => {
      state.headers = action.payload;
    },
    setRows: (state, action) => {
      state.rows = action.payload;
    },
    setCSVData: (state, action) => {
      state.csvData = action.payload;
    },
    setQueryHistory: (state, action) => {
      const exists = state.queryHistory.some(
        (item) => item.query === action.payload
      );
      if (!exists) {
        state.queryHistory.unshift({
          query: action.payload,
          default: state.queryHistory.length + 1,
        });
        Cookies.set('queryHistory', JSON.stringify(state.queryHistory), { expires: 365 });
      }
    },
  },
});

export const {
  setQuery,
  setValue,
  setDefaults,
  setHeaders,
  setRows,
  setCSVData,
  setQueryHistory,
} = querySlice.actions;

export default querySlice.reducer;
