import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./slices/employeeSlice";
import leadReducer from "./slices/leadSlice";

const store = configureStore({
  reducer: {
    employees: employeeReducer,
    leads: leadReducer,
  },
});

export default store;