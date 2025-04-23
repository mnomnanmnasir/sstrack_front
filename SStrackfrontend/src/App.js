import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import AppRouter from "./config/router";
import './index.css';
import { SocketProvider } from './io';
import { store } from './store/store';
import { SnackbarProvider } from "notistack"; // ✅ Import SnackbarProvider
// import AnalyticsTracker from "./sc";


function App() {

  return (
    <>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // ✅ Correct placement
      >
        <GoogleOAuthProvider clientId="612599136411-kkd1krnvssm7u2rmolcupcv7vv0qc8kv.apps.googleusercontent.com">
          <SocketProvider>
            <AppRouter />
          </SocketProvider>
        </GoogleOAuthProvider>
      </SnackbarProvider>
    </>
  );
}

export default App;