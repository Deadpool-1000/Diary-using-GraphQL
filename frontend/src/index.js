import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import Bar from "./components/nav/Bar";
import Login from './pages/Login/Login';
import Compose from "./pages/Compose/Compose";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Bar/>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/compose" element={<Compose/>}/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
