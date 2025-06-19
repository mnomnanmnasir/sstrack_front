import axios from "axios";
import jwtDecode from "jwt-decode";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FerrisWheelSpinner } from 'react-spinner-overlay';
import email from '../../images/email.webp';
import hidePasswordIcon from '../../images/hidePassword.svg';
import passwordIcon from '../../images/password.webp';
import showPasswordIcon from '../../images/showPassword.svg';
import Logo from './assets/images/Logo.png'

function SaLogin() {
    //  "password": "qwerty123",
    // "email": "mailto:kamran@handshr.com"
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [model, setModel] = useState({
    email: "",
    password: ""
  }); 
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    if (model?.email === "" || model?.password === "") {
      enqueueSnackbar("Email and password are required", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      });
      return null;
    } else {
      setLoading(true);
      try {
        const response = await axios.post(`${apiUrl}/signin/ownerSignIn`, {
          email: model?.email,
          password: model?.password,
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const token = response.data.token;
        const decoded = jwtDecode(token);
        // localStorage.setItem("items", JSON.stringify(decoded));
        localStorage.setItem("token_for_sa", response.data.token);
        enqueueSnackbar("Login successsfull", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        })
        setTimeout(() => {
          
          navigate('/sADashboard')
          window.location.reload(); 
        }, 1000);
        setLoading(false)
      }
      catch (error) {
        setLoading(false)
        console.log("catch error", error);
        enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        })
      }
    }
  };

  const fillModel = (key, val) => {
    setModel(prevModel => ({ ...prevModel, [key]: val }));
  };

  return (
    <div style={{
      display: 'flex',
      width: '100vw',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <SnackbarProvider />
      <div style={{
        backgroundColor: '#0D4873',
        borderRadius: '10px',
        padding: '30px',
        width: '90%',
   
        maxWidth: '500px',
        // height:'90%',
        // maxHeight:'686.93px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <img src={Logo} alt="Logo" style={{ width: '250px', marginBottom: '40px' }} />
        <h4 style={{ color: '#ffffff' }}>Log in</h4>
        <p style={{ color: '#b0bec5', marginBottom: '20px' }}>Welcome back! Please enter your details</p>
        
        <label style={{ color: '#b0bec5', fontSize: '14px', textAlign: 'left', width: '100%', marginBottom: '5px' }}>Email</label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '25px'
        }}>
          <img src={email} alt="Email" style={{ marginRight: '10px' }} />
          <input
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '16px'
            }}
            onChange={(e) => fillModel("email", e.target.value)}
            placeholder="example@email.com"
          />
        </div>
        
        <label style={{ color: '#b0bec5', fontSize: '14px', textAlign: 'left', width: '100%', marginBottom: '5px' }}>Password</label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '5px',
          padding: '10px',
          marginBottom: '15px'
        }}>
          <img src={passwordIcon} alt="Password" style={{ marginRight: '10px' }} />
          <input
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '16px'
            }}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => fillModel("password", e.target.value)}
            placeholder="Enter Your Password"
          />
          {model.password !== "" && (
            <img
              style={{ cursor: "pointer", marginLeft: '10px' }}
              width={24}
              src={showPassword ? showPasswordIcon : hidePasswordIcon}
              alt="Toggle Password Visibility"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '47px'
        }}>
          <label style={{ color: '#b0bec5', fontSize: '14px' }}>
            <input type="checkbox" style={{ marginRight: '5px' }} /> Remember me
          </label>
          <a href="#" style={{ color: '#b0bec5', fontSize: '14px', textDecoration: 'none' }}>Forgot Password</a>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#6DBB48',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
             marginBottom: '47px'
          }}
        >
          {loading ? (
            <FerrisWheelSpinner loading={loading} size={28} color="#ffffff" />
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </div>
  );
}

export default SaLogin;
