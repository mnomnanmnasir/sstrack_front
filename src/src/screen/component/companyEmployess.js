import React, { useEffect, useState } from "react";
import Switch from "../../screen/component/switch";
import userIcon from '../../images/groupImg.svg'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useDispatch, useSelector } from "react-redux";
import { setEmployess, setEmployessSetting } from "../../store/adminSlice";
import axios from "axios";
import { enqueueSnackbar, SnackbarProvider } from 'notistack'

const CompanyEmployess = (props) => {

    const state = useSelector((state) => state)
    const [setting, setSetting] = useState([])
    const { Setting, loading } = props
    const employees = useSelector((state) => state?.adminSlice?.employess)
    console.log('Employees', employees)
    // const employees = useSelector((state) => state.adminSlice.employess)
    // .filter((employee) => employee.invitationStatus === 'accepted');

    const activeTab = useSelector((state) => state?.adminSlice?.activeTab)
    const dispatch = useDispatch()
    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };

    async function handleApplySetting(data) {
        
        console.log(data);
        const findUser = employees.find((f) => f.effectiveSettings[data.key] === false)
        try {
            const res = await axios.patch(
                `https://myuniversallanguages.com:9093/api/v1/owner/settingsE/${data.employee._id}`,
                {
                    userId: data.employee._id,
                    effectiveSettings: {
                        ...findUser?.effectiveSettings,
                        [data.key]: data.isSelected,
                        userId: data.employee._id
                    }
                },
                {
                    headers
                }
            );

            if (res.status === 200) {
                enqueueSnackbar("Employee settings updated", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            } else {
                enqueueSnackbar("Failed to update employee settings", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                });
            }

            console.log(res);
        } catch (error) {
            console.error("Error updating employee settings:", error);
            enqueueSnackbar("An error occurred while updating employee settings", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            });
        }
    }

    // const userCount = employees !== null && employees !== undefined ? employees.length : 0;
    // const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null).length : 0;
    // const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null && employee !== {}).length : 0;
    const userCount = employees !== null && employees !== undefined ? employees.filter(employee => employee !== null && Object.keys(employee).length > 0).length : 0;

    console.log(activeTab);

    console.log('=============>', employees);
    const filteredEmployees = employees.filter(employee => employee.name);
    console.log('=##########=>', filteredEmployees);


    return (
        <div>
            <SnackbarProvider />
            {filteredEmployees && filteredEmployees.length > 0 ? filteredEmployees?.map((employee, index) => {

                {/* {employees && employees.length > 0 ? employees?.filter(employee => employee.invitationStatus === 'accepted' || (employee.invitationStatus === 'pending' && employee.invitedBy === userId)).map((employee, index) => { */ }
                return (
                    loading ? (
                        <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                    ) : (
                        <div className="newDiv">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <img width={35} src={userIcon} alt="" />
                                    <p style={{ marginLeft: 10 }}>{employee?.name}</p>
                                </div>
                                <div style={{ marginRight: 10 }}>
                                    <label class="switch">
                                        <input
                                            checked={(
                                                employee?.effectiveSettings?.individualss === true && activeTab?.id === 1 ||
                                                employee?.effectiveSettings?.individualAct === true && activeTab?.id === 2 ||
                                                employee?.effectiveSettings?.individualUrl === true && activeTab?.id === 3 ||
                                                employee?.effectiveSettings?.individualAutoPause === true && activeTab?.id === 5 ||
                                                employee?.effectiveSettings?.individualOffline === true && activeTab?.id === 6
                                            )}
                                            type="checkbox"
                                            onChange={(e) => {
                                                dispatch(setEmployess({
                                                    id: employee._id,
                                                    isSelected: e.target.checked,
                                                    key:
                                                        activeTab.id === 1 ? "individualss" :
                                                            activeTab.id === 2 ? "individualAct" :
                                                                activeTab.id === 3 ? "individualUrl" :
                                                                    activeTab.id === 5 ? "individualAutoPause" :
                                                                        activeTab.id === 6 ? "individualOffline" : ""
                                                }))
                                                handleApplySetting({
                                                    employee,
                                                    isSelected: e.target.checked,
                                                    key:
                                                        activeTab.id === 1 ? "individualss" :
                                                            activeTab.id === 2 ? "individualAct" :
                                                                activeTab.id === 3 ? "individualUrl" :
                                                                    activeTab.id === 5 ? "individualAutoPause" :
                                                                        activeTab.id === 6 ? "individualOffline" : ""
                                                })
                                            }}
                                        />
                                        <span class="slider round"></span>
                                    </label>
                                </div>
                            </div>
                            {(
                                employee?.effectiveSettings?.individualss && activeTab?.id === 1
                            ) ? (
                                <div className="employee-individual-setting">
                                    <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                </div>
                            ) : ""}
                            {(
                                employee?.effectiveSettings?.individualAct && activeTab?.id === 2
                            ) ? (
                                <div className="employee-individual-setting">
                                    <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                </div>
                            ) : ""}
                            {(
                                employee?.effectiveSettings?.individualUrl && activeTab?.id === 3
                            ) ? (
                                <div className="employee-individual-setting">
                                    <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                </div>
                            ) : ""}
                            {(
                                employee?.effectiveSettings?.individualAutoPause && activeTab?.id === 5
                            ) ? (
                                <div className="employee-individual-setting">
                                    <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                </div>
                            ) : ""}
                            {(
                                employee?.effectiveSettings?.individualOffline && activeTab?.id === 6
                            ) ? (
                                <div className="employee-individual-setting">
                                    <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                </div>
                            ) : ""}
                        </div>
                    )
                )
            }) : <p>No employees found</p>
            }
            {/* {employees && employees.length > 0 ? employees?.map((employee, index) => {
                if (employee?.name !== null) {
                    return (
                        loading ? (
                            <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                        ) : (
                            <div className="newDiv">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img width={35} src={userIcon} alt="" />
                                        <p style={{ marginLeft: 10 }}>{employee?.name}</p>
                                    </div>
                                    <div style={{ marginRight: 10 }}>
                                        <label class="switch">
                                            <input
                                                checked={(
                                                    employee?.effectiveSettings?.individualss === true && activeTab?.id === 1 ||
                                                    employee?.effectiveSettings?.individualAct === true && activeTab?.id === 2 ||
                                                    employee?.effectiveSettings?.individualUrl === true && activeTab?.id === 3 ||
                                                    employee?.effectiveSettings?.individualAutoPause === true && activeTab?.id === 5 ||
                                                    employee?.effectiveSettings?.individualOffline === true && activeTab?.id === 6
                                                )}
                                                type="checkbox"
                                                onChange={(e) => {
                                                    dispatch(setEmployess({
                                                        id: employee._id,
                                                        isSelected: e.target.checked,
                                                        key:
                                                            activeTab.id === 1 ? "individualss" :
                                                                activeTab.id === 2 ? "individualAct" :
                                                                    activeTab.id === 3 ? "individualUrl" :
                                                                        activeTab.id === 5 ? "individualAutoPause" :
                                                                            activeTab.id === 6 ? "individualOffline" : ""
                                                    }))
                                                    handleApplySetting({
                                                        employee,
                                                        isSelected: e.target.checked,
                                                        key:
                                                            activeTab.id === 1 ? "individualss" :
                                                                activeTab.id === 2 ? "individualAct" :
                                                                    activeTab.id === 3 ? "individualUrl" :
                                                                        activeTab.id === 5 ? "individualAutoPause" :
                                                                            activeTab.id === 6 ? "individualOffline" : ""
                                                    })
                                                }}
                                            />
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                {(
                                    employee?.effectiveSettings?.individualss && activeTab?.id === 1
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualAct && activeTab?.id === 2
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualUrl && activeTab?.id === 3
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualAutoPause && activeTab?.id === 5
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualOffline && activeTab?.id === 6
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                            </div>
                        )
                    )
                } else {
                    return null;
                }
            }) : null} */}
            {/* {employees && employees.length > 0 ? employees?.filter(employee => employee.invitationStatus === 'accepted').map((employee, index) => {
                if (employee?.invitationStatus === 'accepted' && employee?.accountStatus === 'active' && employee?.name !== null) {
                    return (
                        loading ? (
                            <Skeleton count={1} height="56px" style={{ margin: "10px 0 0 0" }} />
                        ) : (
                            <div className="newDiv">
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img width={35} src={userIcon} alt="" />
                                        <p style={{ marginLeft: 10 }}>{employee?.name}</p>
                                    </div>
                                    <div style={{ marginRight: 10 }}>
                                        <label class="switch">
                                            <input
                                                checked={(
                                                    employee?.effectiveSettings?.individualss === true && activeTab?.id === 1 ||
                                                    employee?.effectiveSettings?.individualAct === true && activeTab?.id === 2 ||
                                                    employee?.effectiveSettings?.individualUrl === true && activeTab?.id === 3 ||
                                                    employee?.effectiveSettings?.individualAutoPause === true && activeTab?.id === 5 ||
                                                    employee?.effectiveSettings?.individualOffline === true && activeTab?.id === 6
                                                )}
                                                type="checkbox"
                                                onChange={(e) => {
                                                    dispatch(setEmployess({
                                                        id: employee._id,
                                                        isSelected: e.target.checked,
                                                        key:
                                                            activeTab.id === 1 ? "individualss" :
                                                                activeTab.id === 2 ? "individualAct" :
                                                                    activeTab.id === 3 ? "individualUrl" :
                                                                        activeTab.id === 5 ? "individualAutoPause" :
                                                                            activeTab.id === 6 ? "individualOffline" : ""
                                                    }))
                                                    handleApplySetting({
                                                        employee,
                                                        isSelected: e.target.checked,
                                                        key:
                                                            activeTab.id === 1 ? "individualss" :
                                                                activeTab.id === 2 ? "individualAct" :
                                                                    activeTab.id === 3 ? "individualUrl" :
                                                                        activeTab.id === 5 ? "individualAutoPause" :
                                                                            activeTab.id === 6 ? "individualOffline" : ""
                                                    })
                                                }}
                                            />
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                </div>
                                {(
                                    employee?.effectiveSettings?.individualss && activeTab?.id === 1
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualAct && activeTab?.id === 2
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualUrl && activeTab?.id === 3
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualAutoPause && activeTab?.id === 5
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                                {(
                                    employee?.effectiveSettings?.individualOffline && activeTab?.id === 6
                                ) ? (
                                    <div className="employee-individual-setting">
                                        <Setting setting={setting} setSetting={setSetting} employee={employee} />
                                    </div>
                                ) : ""}
                            </div>
                        )
                    )
                } else {
                    return null;
                }
            }) : null} */}

        </div>
    );
}

export default CompanyEmployess;