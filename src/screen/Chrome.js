import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, } from 'react';

function Chrome() {


  const sendScanEvent = async () => {
    try {
      const visitKey = 'chrome';
      const token = localStorage.getItem('token');
      let userId = null;
      const apiUrl = process.env.REACT_APP_API_URL;
      // Only decode if token exists
      if (token) {
        try {
          const items = jwtDecode(token);
          userId = items?._id || null;
        } catch (decodeError) {
          console.warn('⚠️ Failed to decode token:', decodeError);
        }
      }

      const body = {
        userId: userId,
        appType: visitKey,
        qrCode: true,
      };

      await axios.post(
        `${apiUrl}/timetrack/downloadHistory`,
        body
      );

      window.location.href =
        'https://chromewebstore.google.com/detail/gkmllhjndmaaapegaopkpapaamfaeckg?utm_source=item-share-cb';
    } catch (error) {
      console.error('❌ Failed to send scan event:', error);
    }
  };

  useEffect(() => {
    sendScanEvent();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#001f3f', // dark blue background
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div className="loader" style={{
        border: '8px solid #f3f3f3',
        borderTop: '8px solid #3498db',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      <h1>Loading Chrome Page...</h1>


      {/* Keyframes for spinning animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Chrome;
