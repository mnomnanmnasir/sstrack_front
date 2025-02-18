import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import AppRouter from "./config/router";
import './index.css';
import { SocketProvider } from './io';
import { store } from './store/store';


function App() {
  
  return (
    <>
      <GoogleOAuthProvider clientId="612599136411-kkd1krnvssm7u2rmolcupcv7vv0qc8kv.apps.googleusercontent.com">
        <SocketProvider>

            <AppRouter />

        </SocketProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;