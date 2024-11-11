import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./config/router";
import { useSelector } from 'react-redux';
import { SocketProvider } from './io';
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="612599136411-kkd1krnvssm7u2rmolcupcv7vv0qc8kv.apps.googleusercontent.com">
        <SocketProvider>
          <AppRouter />;
        </SocketProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;