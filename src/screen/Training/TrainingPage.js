import React, { useEffect } from "react";
import groupCompany from "../../images/Group.webp";
import AllTrainingSections from "./Components/AllTrainingSections";
import NewHeader from "../component/Header/NewHeader";




const TrainingPage = () => {
  useEffect(() => {
    localStorage.setItem("TrainingisCompleted", "true");
  }, [])



  return (
    <>
      <NewHeader language={'en'} show={true} />
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
            <AllTrainingSections />
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingPage;