import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./config/router";
import { useSelector } from 'react-redux';
import { SocketProvider } from './io';


function App() {
  return (
    <>
      <SocketProvider>
        <AppRouter />;
      </SocketProvider>
    </>
  );
}

export default App;