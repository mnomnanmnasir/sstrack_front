import axios from "axios";
import jwtDecode from "jwt-decode";
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FerrisWheelSpinner } from 'react-spinner-overlay';
import email from '../images/email.webp';
import hidePasswordIcon from '../images/hidePassword.svg';
import line from '../images/line.webp';
import passwordIcon from '../images/password.webp';
import showPasswordIcon from '../images/showPassword.svg';

function SaLogin() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [model, setModel] = useState({
    email: "",
    password: ""
  }); 
  const [loading, setLoading] = useState(false)
  const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
//   const navigate = useNavigate();


  const handleLogin = async (e) => {
    if (model?.email === "" || model?.password === "") {
      enqueueSnackbar("Email and password is required", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      })
      return null
    }
    else {
      setLoading(true)
      navigate('/saMain');
    //   try {
    //     const response = await axios.post(`${apiUrl}/signin/`, {
    //       email: model?.email,
    //       password: model?.password,
    //     }, {
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //     })
    //     const token = response.data.token;
    //     const decoded = jwtDecode(token);
    //     localStorage.setItem("items", JSON.stringify(decoded));
    //     localStorage.setItem("token", response.data.token);
    //     enqueueSnackbar("Login successsfull", {
    //       variant: "success",
    //       anchorOrigin: {
    //         vertical: "top",
    //         horizontal: "right"
    //       }
    //     })
    //     setTimeout(() => {
    //       window.location.reload()
    //     }, 1000);
    //     setLoading(false)
    //   }
    //   catch (error) {
    //     setLoading(false)
    //     console.log("catch error", error);
    //     enqueueSnackbar(error?.response?.data?.message ? error?.response?.data?.message : "Network error", {
    //       variant: "error",
    //       anchorOrigin: {
    //         vertical: "top",
    //         horizontal: "right"
    //       }
    //     })
    //   }
    }
  };

  const fillModel = (key, val) => {
    setModel(prevModel => ({ ...prevModel, [key]: val }));
  };

  return (
   
    <div  className="d-flex justify-content-center align-items-center min-vh-100">
      <SnackbarProvider />
      <section className="card p-4" style={{ width: '100%',  }}>
        <div className="maininputdivs" 
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            console.log(e);
            handleLogin()
          }
        }}>
          <div className="mainInputDiv">
            <p className="accessFont">Login your account</p>
            <div className="inputDiv">
              <img src={email} alt="Email" />
              <input className="autofill" onChange={(e) => fillModel("email", e.target.value)} placeholder="Email" />
            </div>
            <div className="inputDiv">
              <img src={passwordIcon} alt="Password" />
              <input className="autofill" type={showPassword ? 'text' : 'password'} onChange={(e) => fillModel("password", e.target.value)} placeholder="Password (8 or more characters)" />
              {model.password !== "" && <img style={{ cursor: "pointer" }} width={30} src={showPassword ? showPasswordIcon : hidePasswordIcon} alt="Password" onClick={() => setShowPassword(!showPassword)} />}
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading} type="submit" className={loading ? "disabledAccountButton" : "accountButton"}>{loading ? <FerrisWheelSpinner loading={loading} size={28} color="#6DBB48" /> : "Login"}</button>
          </div>
        </div>
    
      </section>
      
    </div>
  );
}

export default SaLogin;