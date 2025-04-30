import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import axios from "axios";
import { setEmployessSetting5 } from "../../store/adminSlice"; // Adjust path if needed

function IndividualAutoPauseToggle() {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.adminSlice.employess);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  const handleRadioChange = async (employee, shouldPause) => {
    const updatedSettings = {
      ...employee.effectiveSettings,
      individualAutoPause: true,
      autoPauseTrackingAfter: {
        ...employee.effectiveSettings?.autoPauseTrackingAfter,
        pause: shouldPause,
      },
    };

    try {
      const response = await axios.patch(
        `https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${employee._id}`,
        {
          userId: employee._id,
          effectiveSettings: updatedSettings,
        },
        { headers }
      );

      if (response.status === 200) {
        enqueueSnackbar("AutoPause setting updated!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        dispatch(
          setEmployessSetting5({
            id: employee._id,
            key: "pause",
            value: shouldPause,
          })
        );
      } else {
        enqueueSnackbar("Failed to update AutoPause setting.", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } catch (error) {
      console.error("❌ AutoPause Error:", error);
      enqueueSnackbar("Error updating AutoPause setting.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  return (
    <div>
      <SnackbarProvider />
      <h5>Individual AutoPause Settings</h5>
      {employees && employees.length > 0 ? (
        employees.map((employee) => {
          const pauseStatus = employee?.effectiveSettings?.autoPauseTrackingAfter?.pause;

          return (
            <div
              key={employee._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <p style={{ fontWeight: "bold", marginBottom: "8px" }}>{employee?.email}</p>

              <div>
                <label>
                  <input
                    type="radio"
                    name={`pause-${employee._id}`}
                    checked={pauseStatus === true}
                    onChange={() => handleRadioChange(employee, true)}
                  />
                  {" "}Pause After Inactivity
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="radio"
                    name={`pause-${employee._id}`}
                    checked={pauseStatus === false}
                    onChange={() => handleRadioChange(employee, false)}
                  />
                  {" "}Do Not Pause
                </label>
              </div>
            </div>
          );
        })
      ) : (
        <p>No employees found</p>
      )}
    </div>
  );
}

export default IndividualAutoPauseToggle;
