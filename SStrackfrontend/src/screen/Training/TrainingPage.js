import React, { useEffect, useState } from "react";
import groupCompany from "../../images/Group.webp";
import jwtDecode from "jwt-decode";
import Just from "./Components/AllTrainingSections";
import AllTrainingSections from "./Components/AllTrainingSections";




const TrainingPage = () => {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;
  useEffect(() => {
    localStorage.setItem("TrainingisCompleted", "true");
  }, [])



  return (
    <div className="container">
      <div className="userHeader">
        <div className="d-flex align-items-center gap-3">
          <div>
            <img src={groupCompany} alt="Group Icon" />
          </div>
          <h5>Training</h5>
        </div>
      </div>

      <div className="mainwrapper">
        <div className="ownerTeamContainer">
         <AllTrainingSections/>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;