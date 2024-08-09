import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import store from "./store/store.jsx";
import LoginStatus from "./LoginStatus.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        {/*<React.StrictMode>*/}
            <Provider store={store}>
                <LoginStatus />
                <App />
            </Provider>
        {/*</React.StrictMode>,*/}
    </BrowserRouter>
)
