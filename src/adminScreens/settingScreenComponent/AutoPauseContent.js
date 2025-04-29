import { useDispatch, useSelector } from "react-redux";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { setEmployessSetting5, setAllUserSetting7, setAllUserSetting8 } from "../../store/adminSlice"; // ✅ Update with your correct path
import CompanyEmployess from "../../screen/component/companyEmployess"; // ✅ Update if needed
import axios from "axios";

function AutoPauseContent() {
  const employees = useSelector((state) => state.adminSlice.employess);
  const dispatch = useDispatch();
  let token = localStorage.getItem('token');

  let headers = {
    Authorization: 'Bearer ' + token,
  };

  const handleApplySettings = async (employee, type, setting) => {
    const setting1 = {
      ...employee.effectiveSettings,
      individualAutoPause: true,
      autoPauseTrackingAfter: {
        ...employee.effectiveSettings.autoPauseTrackingAfter,
        pause: setting
      }
    };
    const setting2 = {
      ...employee.effectiveSettings,
      individualAutoPause: true,
      autoPauseTrackingAfter: {
        ...employee.effectiveSettings.autoPauseTrackingAfter,
        frequency: setting
      }
    };

    try {
      const res = await axios.patch(
        `https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${employee._id}`,
        {
          userId: employee._id,
          effectiveSettings: type === "pause" ? setting1 : setting2
        },
        { headers }
      );
      if (res.status === 200) {
        enqueueSnackbar("Employee settings updated", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  function Setting({ employee }) {
    return (
      <>
        <div>
          <input
            type="radio"
            id={`${employee._id}_pauseAfter`}
            name={`${employee._id}_pauseAfterOption`}
            value="Pause after"
            checked={employee?.effectiveSettings?.autoPauseTrackingAfter?.pause === true}
            onChange={() => {
              handleApplySettings(employee, "pause", true);
              dispatch(setEmployessSetting5({ id: employee._id, key: "pause", value: true }));
            }}
          />
          <label htmlFor={`${employee._id}_pauseAfter`}>Pause after</label>
        </div>

        <div>
          <input
            className="number"
            type="number"
            placeholder="5"
            value={employee?.effectiveSettings?.autoPauseTrackingAfter?.frequency || ""}
            onChange={(e) => {
              if (e.target.value >= 0) {
                handleApplySettings(employee, "frequency", e.target.value);
                dispatch(setEmployessSetting5({ id: employee._id, key: "frequency", value: e.target.value }));
              }
            }}
          />
          <label style={{ paddingLeft: "18px", fontSize: "18px", fontWeight: "500", color: "#0E4772" }}>
            minutes of user inactivity
          </label>
        </div>

        <div>
          <input
            type="radio"
            id={`${employee._id}_doNotPause`}
            name={`${employee._id}_doNotPauseOption`}
            value="Do not pause"
            checked={employee?.effectiveSettings?.autoPauseTrackingAfter?.pause === false}
            onChange={() => {
              handleApplySettings(employee, "pause", false);
              dispatch(setEmployessSetting5({ id: employee._id, key: "pause", value: false }));
            }}
          />
          <label htmlFor={`${employee._id}_doNotPause`}>Do not pause</label>
        </div>
      </>
    );
  }

  return (
    <div>
      <SnackbarProvider />
      <div style={{ marginBottom: "10px" }}>
        <p className="settingScreenshotHeading">Auto-pause tracking after</p>
        <p style={{ fontSize: "14px" }}>
          Tracking will automatically pause after the specified period of inactivity and will automatically resume when user becomes active again.
        </p>
      </div>

      <div className="activityLevelIndividual">
        <p className="settingScreenshotIndividual">Individual Settings</p>
        <p className="individualSettingFont">If enabled, the individual setting will be used instead of the team setting</p>
        <CompanyEmployess Setting={Setting} />
      </div>
    </div>
  );
}

export default AutoPauseContent;
