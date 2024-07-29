import { configureStore } from '@reduxjs/toolkit'
import loginStatus from "./reducer/loginReducers.jsx";

const store = configureStore({
    reducer: {loginStatus},
});

export default store;