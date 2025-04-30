import { useDispatch, useSelector } from "react-redux";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { setEmployessSetting5 } from "../../store/adminSlice";
import axios from "axios";

function AutoPauseContent() {
  const employees = useSelector((state) => state.adminSlice.employess);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: "Bearer " + token,
  };

  const handleApplySettings = async (employee, type, setting) => {
    const settingData = {
      ...employee.effectiveSettings,
      individualAutoPause: true,
      autoPauseTrackingAfter: {
        ...employee.effectiveSettings?.autoPauseTrackingAfter,
        [type]: setting, // dynamically set "pause" or "frequency"
      }
    };

    try {
      const res = await axios.patch(
        `https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${employee._id}`,
        { effectiveSettings: settingData },
        { headers }
      );

      if (res.status === 200) {
        enqueueSnackbar("Employee settings updated", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        dispatch(setEmployessSetting5({ id: employee._id, key: type, value: setting }));
      }
    } catch (error) {
      console.error("❌ Error updating AutoPause settings:", error?.response?.data || error.message);
      enqueueSnackbar("Failed to update settings", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    }
  };

  return (
    <div>
      <SnackbarProvider />
      <div style={{ marginBottom: "10px" }}>
        <p className="settingScreenshotHeading">Auto-pause tracking after</p>
        <p style={{ fontSize: "14px" }}>
          Tracking will automatically pause after the specified period of inactivity and will automatically resume when the user becomes active again.
        </p>
      </div>

      <div className="activityLevelIndividual">
        <p className="settingScreenshotIndividual">Individual Settings</p>
        <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>

        {employees?.map((employee) => {
          const settings = employee?.effectiveSettings || {};
          const autoPause = settings.autoPauseTrackingAfter || {};

          return (
            <div
              key={employee._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "15px"
              }}
            >
              <h6>{employee?.name || employee?.email}</h6>

              <div style={{ marginTop: "10px" }}>
                <div>
                  <input
                    type="radio"
                    id={`${employee._id}_pauseAfter`}
                    name={`${employee._id}_pauseOption`}
                    checked={autoPause.pause === true}
                    onChange={() => handleApplySettings(employee, "pause", true)}
                  />
                  <label htmlFor={`${employee._id}_pauseAfter`} style={{ marginLeft: "6px" }}>
                    Pause after inactivity
                  </label>
                </div>

                <div style={{ marginTop: "6px" }}>
                  <input
                    type="radio"
                    id={`${employee._id}_doNotPause`}
                    name={`${employee._id}_pauseOption`}
                    checked={autoPause.pause === false}
                    onChange={() => handleApplySettings(employee, "pause", false)}
                  />
                  <label htmlFor={`${employee._id}_doNotPause`} style={{ marginLeft: "6px" }}>
                    Do not pause
                  </label>
                </div>

                <div style={{ marginTop: "10px" }}>
                  <input
                    type="number"
                    placeholder="5"
                    className="form-control"
                    style={{ width: "120px", display: "inline-block", marginRight: "10px" }}
                    value={autoPause.frequency || ""}
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        handleApplySettings(employee, "frequency", parseInt(e.target.value));
                      }
                    }}
                  />
                  <label style={{ fontSize: "14px", color: "#0E4772" }}>
                    minutes of user inactivity
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AutoPauseContent;
