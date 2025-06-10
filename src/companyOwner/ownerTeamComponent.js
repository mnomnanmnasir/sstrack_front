import React, { useEffect, useRef, useState } from "react";
import warning from '../images/warning.png'
import pause from "../images/pauseIcon.webp";
import archive from "../images/Archive.webp";
import deleteIcon from "../images/DeleteTeam.webp";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import settingIcon from '../images/setting-icon.svg'
import search from "../images/searchIcon.webp";
import CurrencyConverter from "../screen/component/currencyConverter";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import UserSettings from "./owner-setting-components/userEffectiveSettings";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../io'; // Correct import
import { setLogout } from "../store/timelineSlice";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import TimezoneSelect from "react-timezone-select";
import PayStubSettings from "../screen/component/PayStubSetting/payStubSetting";

function OwnerTeamComponent(props) {

    const socket = useSocket()


    const { loading, setLoading } = useLoading()
    const [viewTimeline, setViewTimeline] = useState(false)
    const [role, setRole] = useState("")
    const [data, setData] = useState({});
    let { fixId, archived_unarchived_users, deleteUser, isUserArchive, selectedGroupName, inviteStatus, handleSendInvitation, payrate, reSendInvitation, users, setUsers, selectedUser } = props
    const apiUrl = "https://myuniversallanguages.com:9093/api/v1";
    const [shiftPremiumRate, setShiftPremiumRate] = useState('');
    const [overtimeRate, setOvertimeRate] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [appliedTaxCountry, setAppliedTaxCountry] = useState('');
    const [currency, setCurrency] = useState('');
    const [appliedTaxState, setAppliedTaxState] = useState('');
    const [appliedTaxes, setAppliedTaxes] = useState('');
    const [appliedDeductions, setAppliedDeductions] = useState('');

    const [vacationPay, setVacationPay] = useState('');
    const [payPeriodType, setPayPeriodType] = useState('');
    const [ratePerHour, setRatePerHours] = useState('');
    const [pay_type, setPayType] = useState('hourly'); // ✅ Default value
    const ownerTeamRef = useRef(null);

    const token = localStorage.getItem('token');
    const headers = {
        Authorization: "Bearer " + token,
    };
    const [timezone, setSelectedTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone


    );

    const [updatedPayrate, setUpdatedPayrate] = useState({
        ratePerHour: '',
        currency: '',
        payType: ''
    });

    const usStateNameToCode = {
        "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
        "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
        "District of Columbia": "DC", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI",
        "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
        "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
        "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
        "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
        "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
        "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
        "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI",
        "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX",
        "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
        "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
    };

    const countryStateMap = {
        canada: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"],
        // "usa": Object.keys(usStateNameToCode), // <- Only use full names in dropdown
        "usa": Object.entries(usStateNameToCode).map(([name, code]) => [code, name]),
        // Pakistan: ["Punjab", "Sindh", "KPK", "Balochistan"],
        // Philiphines: ["Metro Manila", "Cebu", "Davao", "Laguna"],
        india: ["Maharashtra", "Karnataka", "West Bengal", "Gujarat", "Tamil Nadu", "Telangana", "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Kerala", "Punjab", "Odisha"]
        // "Saudia Arabia": ["Riyadh", "Jeddah", "Dammam", "Mecca"],
    };

    const [payrateState, setPayrateState] = useState(null);

    const handlePayrateUpdate = (data) => {
        setUpdatedPayrate(data); // update local state
        setHourlyRate(data.ratePerHour); // directly update PayStubSettings too
        setCurrency(data.currency);
        setPayType(data.payType);

        // ✅ Update internal billingInfo state to show "Edit payrate"
        setPayrateState({ billingInfo: data });
    };

    const [selectedGroupId, setSelectedGroupId] = useState(null);

    const currencySymbols = {
        USD: "$",     // United States Dollar
        PKR: "PKR",   // Pakistani Rupee (capitalize)
        // pkr: "PKR",   // Pakistani Rupee (without capitalize)
        CAD: "C$",    // Canadian Dollar
        INR: "₹",     // Indian Rupee
        PHP: "₱",     // Philippine Peso
        EUR: "€",     // Euro
        GBP: "£",     // British Pound
        AUD: "A$",    // Australian Dollar
        JPY: "¥"      // Japanese Yen
    };

    useEffect(() => {
        if (selectedUser?.timezone) {
            setSelectedTimezone(selectedUser.timezone);
        }
    }, [selectedUser]);
    console.log("Current Timezone:", timezone);
    const handleStartDateChange = async (selectedTimezone) => {

        setSelectedTimezone(selectedTimezone);

        const apiUrl = `https://myuniversallanguages.com:9093/api/v1/owner/updateUsersTimezone/${fixId}`;

        const payload = {
            timezone: selectedTimezone.value.toString(),  // Example: "Asia/Kabul"
            timezoneOffset: selectedTimezone.offset.toString()  // Example: "4.5"
        };

        const token = localStorage.getItem('token'); // Replace with your actual token retrieval method

        try {
            const response = await axios.patch(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            });

            console.log('Timezone updated successfully:', payload);
            enqueueSnackbar(response?.data?.message, {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        } catch (error) {
            console.error('Error updating timezone:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        if (fixId && ownerTeamRef.current) {
            ownerTeamRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [fixId]);

    const updateStubSettings = async () => {

        const payload = {
            shiftPremiumRate: shiftPremiumRate,
            overtimeRate: overtimeRate,
            hourlyRate: hourlyRate,
            appliedTaxCountry: appliedTaxCountry,
            currency: currency,
            appliedTaxState:
                appliedTaxCountry === "usa" && usStateNameToCode[appliedTaxState]
                    ? usStateNameToCode[appliedTaxState]
                    : appliedTaxState,
            vacationPay: vacationPay,
            pay_type: pay_type || "hourly", // ✅ enforce default if empty
            payPeriodType: payPeriodType,
            appliedTaxes: appliedTaxes,
            appliedDeductions: appliedDeductions // ✅ Add this
        };

        try {
            const response = await axios.post(
                `${apiUrl}/superAdmin/updateStubsSetting/${fixId}`,
                payload,
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar('Stub settings updated successfully!', {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" }
                });
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error || // fallback if message is in `error` key
                "Failed to update stub settings.";

            enqueueSnackbar(errorMessage, {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" }
            });

            console.error('Error updating stub settings:', errorMessage);
        }
    };

    useEffect(() => {
        const fetchSelectedUserBillingInfo = async () => {
            if (!selectedUser || !selectedUser._id) {
                console.log('⚠️ No selected user');
                setShiftPremiumRate('');
                setOvertimeRate('');
                setHourlyRate('');
                setAppliedTaxCountry('');
                setAppliedTaxState('');
                setVacationPay('');
                setPayPeriodType('');
                setPayType('');
                setRatePerHours('')
                return;
            }
            try {
                const response = await axios.get(`${apiUrl}/owner/companies`, { headers });
                console.log("✅ Companies API Response:", response.data);

                const companies = response.data?.companies || [];

                let foundEmployee = null;
                for (const company of companies) {
                    if (company.employees && company.employees.length > 0) {
                        foundEmployee = company.employees.find(emp => emp._id === selectedUser._id);
                        if (foundEmployee) break;
                    }
                }

                if (foundEmployee) {
                    console.log("🎯 Found Employee:", foundEmployee);

                    setShiftPremiumRate(foundEmployee?.billingInfo?.shiftPremiumRate || '');
                    setOvertimeRate(foundEmployee?.billingInfo?.overtimeRate || '');
                    setHourlyRate(foundEmployee?.billingInfo?.ratePerHour || '');
                    setAppliedTaxCountry(foundEmployee?.appliedTaxCountry || '');
                    // setAppliedTaxState(foundEmployee?.appliedTaxState || '');
                    setAppliedTaxState(
                        foundEmployee?.appliedTaxCountry === "usa"
                            ? usStateNameToCode[foundEmployee?.appliedTaxState] || foundEmployee?.appliedTaxState
                            : foundEmployee?.appliedTaxState
                    );
                    console.log("📍 Applied Tax State:", foundEmployee?.appliedTaxState);
                    setCurrency(foundEmployee?.billingInfo?.currency || '');
                    setVacationPay(foundEmployee?.billingInfo?.vacationPay || '');
                    setPayPeriodType(foundEmployee?.payPeriodType || '');
                    setPayType(foundEmployee?.billingInfo?.pay_type);
                    setRatePerHours(foundEmployee?.billingInfo?.ratePerHour || '');

                } else {
                    console.log('⚠️ No employee found for selected user.');
                }
            } catch (error) {
                console.error('❌ Error fetching selected user billing info:', error.response?.data || error.message);
            }
        };

        fetchSelectedUserBillingInfo();
    }, [selectedUser?._id]);  // ✅ Dependency yahan selectedUser._id hai

    useEffect(() => {
        const fetchSelectedUserData = async () => {
            if (!selectedUser || !selectedUser._id) return;

            try {
                const response = await axios.get(`${apiUrl}/owner/user/${selectedUser._id}`, { headers });
                console.log("📥 Selected User API Response:", response.data);

                if (response.status === 200 && response.data) {
                    const responseData = response.data;

                    setShiftPremiumRate(responseData?.billingInfo?.shiftPremiumRate || '');
                    setOvertimeRate(responseData?.billingInfo?.overtimeRate || '');
                    setHourlyRate(responseData?.billingInfo?.ratePerHour || '');
                    setAppliedTaxCountry(responseData?.appliedTaxCountry || '');
                    setAppliedTaxState(responseData?.appliedTaxState || '');
                    setCurrency(responseData?.billingInfo?.currency || '');
                    setVacationPay(responseData?.vacationPay || '');
                    setPayPeriodType(responseData?.payPeriodType || '');
                    setPayType(responseData?.billingInfo?.payType);
                    setRatePerHours(responseData?.billingInfo?.ratePerHour || '');
                    setAppliedDeductions(responseData?.appliedDeductions || '');
                    setAppliedTaxes(responseData?.appliedTaxes || '');

                    setData(responseData); // ✅ Data set for name, email etc.
                }
            } catch (error) {
                console.error('❌ Error fetching selected user:', error.response?.data || error.message);
            }
        };

        fetchSelectedUserData();
    }, [selectedUser?._id]);



    const [isUserArchived, setIsUserArchived] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const handleUserArchive = (data) => {
            console.log('User archived event received:', data);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === data.userId ? { ...user, isArchived: true } : user
                )
            );
            if (data.userId === user._id) {
                // Log the user out
                logOut();
            }
        };

        const handleReload = () => {
            // Reload data from server
            getData();
        };

        function logOut() {
            // localStorage.removeItem("items");
            localStorage.removeItem("token");
            localStorage.removeItem("cachedData");
            dispatch(setLogout());
            navigate('/');
            window.location.reload();
        }

        const handleUserUnarchive = (data) => {
            console.log('User unarchived event received:', data);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === data.userId ? { ...user, isArchived: false } : user
                )

            );

            if (data.userId === user._id) {
                // Log the user out
                logOut();
            }
        };

        const handleRoleUpdate = (data) => {
            console.log('Role updated event received:', data);
            const { userId, role } = data;
            changeRole(userId, role);
        };

        if (socket) {
            console.log('Socket connection established:', socket.connected);




            socket.on('user_unarchive', handleUserUnarchive);
            //   socket.on('role_update', handleRoleUpdate);
            socket.on('role_update', (data) => {
                const { userId, role } = data;
                const userIndex = users.findIndex((user) => user._id === userId);
                if (userIndex !== -1) {
                    const updatedUser = { ...users[userIndex], role };
                    setUsers([...users.slice(0, userIndex), updatedUser, ...users.slice(userIndex + 1)]);
                }
            });
            socket.on('user_archived', handleReload);
            socket.on('user_archived', (data) => { // Add this line
                if (data.userId === user._id) {
                    logOut();
                }
            });
            return () => {
                console.log('Socket connection closed:', socket.connected);
                socket.off('user_archive', handleUserArchive);
                socket.off('user_unarchive', handleUserUnarchive);
                socket.off('role_update', handleRoleUpdate);
            };
        }
    }, [socket, setUsers, setRole]);



    const changeRole = (userId, newRole) => {
        updateRole(userId, newRole);
    };

    const updateRole = (userId, newRole) => {
        // Update the role of the user in the local state
        const userIndex = users.findIndex((user) => user._id === userId);
        if (userIndex !== -1) {
            const updatedUser = { ...users[userIndex], role: newRole };
            setUsers([...users.slice(0, userIndex), updatedUser, ...users.slice(userIndex + 1)]);
        }

        // Emit the role_update event to other devices
        socket.emit('role_update', { userId, role: newRole });
    };
    //     // When archiving a user, emit an event to the server

    const handleGroupToggle = async (userId, isCurrentlyAssigned) => {
        const isAssign = !isCurrentlyAssigned;

        try {
            const response = await axios.post(
                `${apiUrl}/userGroup/addEmployeesToGroup/${selectedGroupId}`,
                {
                    isAssign,
                    userIds: [userId]
                },
                { headers }
            );

            if (response.status === 200 || response.status === 201) {
                enqueueSnackbar(`User ${isAssign ? "assigned to" : "removed from"} group`, {
                    variant: "success",
                    anchorOrigin: { vertical: "top", horizontal: "right" },
                });

                setUsers(prev =>
                    prev.map(user =>
                        user._id === userId ? { ...user, isGroupAssigned: isAssign } : user
                    )
                );
            }
        } catch (error) {
            console.error("Error assigning user to group:", error);
            enqueueSnackbar("Something went wrong", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "right" },
            });
        }
    };


    const getData = async (fixId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/owner/user/${fixId}`, { headers });

            console.log("API Response:", response); // Log the entire response for debugging

            if (response.status === 200) {
                setLoading(false);
                if (response.data) {
                    const responseData = response.data; // Assuming data is directly under 'data'
                    setData(responseData); // Set data from API response
                    console.log("Data in component:", responseData); // Log the data received

                } else {
                    console.error("API Error:", response.data.message);
                }
            } else {
                console.error("Failed to fetch data:", response.statusText);
            }
        }
        catch (error) {
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };



    async function changeUserType(role) {
        try {
            const res = await fetch(`${apiUrl}/userGroup/edit/${fixId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                body: JSON.stringify({
                    userType: role
                }),
            })
            const dataRes = await res.json()
            enqueueSnackbar("Settings saved", {
                variant: "success",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
            console.log("dataRes ====>", dataRes);
        } catch (error) {
            console.log(error);
        }
    }



    const handleAssignUser = async (userID) => {
        try {
            const response = await axios.patch(`${apiUrl}/superAdmin/assign-user-to-manager/${fixId}`, {
                userIds: [...new Set([...users.filter(user => user.isAssign).map(user => user._id), userID])]
            }, { headers })
            if (response.status) {
                const assignedUsersCount = users.filter(user => user.isAssign).length;
                enqueueSnackbar(`Settings saved`, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
        catch (err) {
            setLoading(false)
            console.log(err);
        }
    }




    const handleRemoveAssignUser = async (id) => {
        try {
            const response = await axios.patch(`${apiUrl}/superAdmin/remove-user-from-manager/${fixId}`, {
                userId: id
            }, { headers })
            if (response.status) {
                enqueueSnackbar("Settings saved", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
        }
        catch (err) {
            setLoading(false)
            console.log(err);
        }
    }

    useEffect(() => {
        getData(fixId);
    }, [fixId])

    const user = jwtDecode(JSON.stringify(token));
    const navigate = useNavigate()

    useEffect(() => {
        setRole(data.userType)
    }, [data])



    const userType = 'owner'; // This should come from your authentication logic


    return (
        <div ref={ownerTeamRef} style={{ width: "100% !important" }}>
            <SnackbarProvider />
            {fixId ? (
                <>
                    {/* <p className="fs-2 text-success ">{data?.company}</p> */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
                        <p className="employeeDetail mt-3">Employee Details</p>
                        <div className="pauseDeleteMain">
                            {!inviteStatus && (
                                <>
                                    {user.userType !== 'manager' && (
                                        <>
                                            {selectedUser?.userType !== 'owner' &&
                                                (
                                                    <>
                                                        {/* <div className="pauseMain mt-3">
                                                            <p><img className="paueIcon" src={pause} alt="pauseIcon.png" />Pause</p>
                                                        </div> */}
                                                        <div className="archiveMain mt-3" onClick={archived_unarchived_users}>

                                                            <p><img className="paueIcon" src={archive} alt="Archive.png" />{isUserArchive ? "Archive" : "Unarchive"}</p>
                                                        </div>
                                                    </>
                                                )}
                                        </>
                                    )}
                                </>
                            )}
                            {user?.userType !== 'manager' && deleteUser && (
                                <>
                                    {selectedUser?.userType !== 'owner' && (
                                        <>
                                            <div className="deleteMain mt-3" onClick={deleteUser}>
                                                <p><img className="paueIcon" src={deleteIcon} alt="DeleteTeam.png" />Delete</p>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                            {/* {console.log("User Type", userType)} */}
                        </div>
                    </div>

                    {selectedGroupName && (
                        <div style={{ marginBottom: "20px" }}>
                            <p className="employeeDetail">Selected Group</p>
                            <p className="employeeDetailName2" style={{ fontWeight: "bold", color: "#28659C" }}>{selectedGroupName}</p>
                        </div>
                    )}
                    {/* <div className="container-fluid">
                        {data && Object.keys(data).length > 0 ? (
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="employeeDetailName1">{data.name}</p>
                                    <p className="employeeDetailName2">{data.email}</p>
                                </div>
                                <>
                                    {user?.userType !== 'manager' && !selectedUser?.inviteStatus && (
                                        <>

                                            {selectedUser?.userType !== 'owner' && (
                                                <div>
                                                    <CurrencyConverter userId={fixId} payrate={payrate} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>

                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div> */}
                    {/* <div className="container"> */}
                    {data && Object.keys(data).length > 0 ? (
                        <div className="row">
                            {/* Left Section - Name & Email */}
                            <div className="col-12 col-md-9 mb-3 mb-md-0 text-md-start">
                                <p className="employeeDetailName1 mb-1" style={{ wordBreak: "break-word" }}>{data.name}</p>
                                <p className="employeeDetailName2" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                    {data.email}
                                </p>
                            </div>

                            {/* Right Section - Currency Converter */}
                            <div className="col-12 col-md-3 text-md-end mt-2 mt-md-0">
                                {user?.userType !== 'manager' && !selectedUser?.inviteStatus && (
                                    <>
                                        {selectedUser?.userType !== 'owner' && (
                                            // <CurrencyConverter userId={fixId} payrate={payrate} />
                                            <CurrencyConverter
                                                userId={fixId}
                                                // payrate={payrate}
                                                payrate={payrateState || payrate}
                                                onPayrateUpdate={handlePayrateUpdate}
                                            />

                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p></p>
                    )}
                    {/* </div> */}

                    <div className="col-12 col-md-9 mb-3 mb-md-0 text-md-start">
                        {user?.userType !== 'manager' && !selectedUser?.inviteStatus && (
                            <>
                                {selectedUser?.userType !== 'owner' && (
                                    <>
                                        {(updatedPayrate.ratePerHour || ratePerHour) && (
                                            <p className="employeeDetailName2 mb-1" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
                                                PayRate:
                                                <span>
                                                    {currencySymbols[updatedPayrate.currency || currency] || updatedPayrate.currency || currency}
                                                    {updatedPayrate.ratePerHour || ratePerHour}
                                                    {/* {currencySymbols[currency] || currency}{ratePerHour} */}
                                                </span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {user?.userType !== 'manager' &&
                        selectedUser?.userType !== 'owner' &&
                        !selectedUser?.inviteStatus && (  // ✅ Check if user has accepted the invite
                            // <div style={{ marginTop: 30, marginBottom: 30 }}>
                            //     <p className="employeeDetail">Select Timezone</p>
                            //     <div className="dropdown" style={{ minWidth: 440 }}>
                            //         <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                            //     </div>
                            // </div>
                            <div className="my-4">
                                <p className="employeeDetail ">Select Timezone</p>

                                <div className="row justify-content-start">
                                    <div className="col-12 col-md-8 col-lg-12">
                                        <div className="dropdown w-100">
                                            <TimezoneSelect value={timezone} onChange={handleStartDateChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    {user?._id === fixId && (user?.userType === "owner" || user?.userType === "admin") ? (
                        <>
                            <p className="employeeDetailName1">Role</p>
                            <p className="employeeDetailName2" style={{ textTransform: "capitalize" }}>{user?.userType}</p>
                        </>
                    ) : selectedUser?.userType === "owner" ? (
                        <>
                            <p className="employeeDetailName1">Role</p>
                            <p className="employeeDetailName2" style={{ textTransform: "capitalize" }}>{selectedUser?.userType}</p>
                            {console.log('Selected User: ', userType)}
                            {selectedGroupName && (
                                <div style={{ marginBottom: "20px" }}>
                                    <p className="employeeDetail">Selected Group</p>
                                    <p className="employeeDetailName2" style={{ fontWeight: "bold", color: "#28659C" }}>
                                        {selectedGroupName}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : ""}
                    {selectedGroupId && (
                        <div>
                            <p className="employeeDetail">Assign Users to Group</p>
                            {users?.map(user => (
                                <div key={user._id} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                    <input
                                        type="checkbox"
                                        checked={user.isGroupAssigned || false}
                                        onChange={() => handleGroupToggle(user._id, user.isGroupAssigned)}
                                    />
                                    <label style={{ marginLeft: 10 }}>{user.name}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    {isUserArchive === true && (
                        <>
                            {selectedUser?.userType !== 'owner' && !selectedUser?.inviteStatus && (
                                <>
                                    {loading ? <Skeleton count={1} width="100px" height="24px" style={{ margin: "0 0 16px 0" }} /> : inviteStatus === false &&

                                        <p onClick={() => {
                                            navigate(`/timeline/${fixId}`);
                                        }} style={{
                                            fontWeight: "600",
                                            color: "green",
                                            cursor: "pointer",
                                            textDecoration: "underline"
                                        }}>View timeline</p>}
                                </>
                            )}
                            <div>
                                {data && Object.keys(data).length > 0 && data.name ? ( // Check if data is not empty and data.name exists
                                    // {data && Object.keys(data).length > 0 ? (
                                    <>
                                        {/* <p className="employeeDetailName1">{data.name}</p>
                                            <p className="employeeDetailName2">{data.email}</p> */}

                                        {(user?.userType === 'manager') ? (
                                            // Display only Manager role for managers
                                            <div>
                                                {/* Manager-specific content can go here */}
                                            </div>
                                        ) : (
                                            // Display role options for other scenarios
                                            <div>
                                                {!(
                                                    user?.userType === 'admin' &&
                                                    (selectedUser?.userType === 'owner' || selectedUser?._id === user?._id)
                                                ) &&
                                                    !(user?.userType === 'owner' && selectedUser?._id === user?._id) && (
                                                        <div>
                                                            <p style={{ color: '#0E4772', fontWeight: '600', fontSize: '22px' }}>Role</p>
                                                            {/* User Role */}
                                                            <div>
                                                                <input
                                                                    disabled={data?.userType === 'owner'}
                                                                    checked={role === 'user'}
                                                                    onChange={() => {
                                                                        setRole('user');
                                                                        changeUserType('user');
                                                                    }}
                                                                    type="radio"
                                                                    id="html"
                                                                    name="user"
                                                                    value="user"
                                                                    className={data?.userType === 'owner' ? 'disabledinput' : ''}
                                                                />
                                                                <label htmlFor="html">
                                                                    User -{' '}
                                                                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                                                                        can see their own data only
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            {/* Admin Role */}
                                                            <div style={{ margin: '10px 0 0 0' }}>
                                                                <input
                                                                    disabled={data?.userType === 'owner'}
                                                                    checked={role === 'admin'}
                                                                    onChange={() => {
                                                                        setRole('admin');
                                                                        changeUserType('admin');
                                                                    }}
                                                                    type="radio"
                                                                    id="css"
                                                                    name="admin"
                                                                    value="admin"
                                                                    className={data?.userType === 'owner' ? 'disabledinput' : ''}
                                                                />
                                                                <label htmlFor="css">
                                                                    Admin -{' '}
                                                                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                                                                        full control over Team, Projects & Settings. Does not have access to
                                                                        owner's "My Account" page settings.
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            {/* Manager Role */}
                                                            <div style={{ margin: '10px 0 0 0' }}>
                                                                <input
                                                                    checked={role === 'manager'}
                                                                    onChange={() => {
                                                                        setRole('manager');
                                                                        changeUserType('manager');
                                                                    }}
                                                                    type="radio"
                                                                    id="owner2"
                                                                    name="manager"
                                                                    value="manager"
                                                                />
                                                                <label htmlFor="owner2">
                                                                    Manager -{' '}
                                                                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                                                                        can see selected user's Timeline & Reports (but not rates)
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p></p>
                                )}

                                {selectedUser?.userType !== 'owner' && selectedUser?.inviteStatus === false && (
                                    <>
                                        <PayStubSettings
                                            shiftPremiumRate={shiftPremiumRate}
                                            setShiftPremiumRate={setShiftPremiumRate}
                                            overtimeRate={overtimeRate}
                                            setOvertimeRate={setOvertimeRate}
                                            hourlyRate={hourlyRate}
                                            setHourlyRate={setHourlyRate}
                                            appliedTaxCountry={appliedTaxCountry}
                                            setAppliedTaxCountry={setAppliedTaxCountry}
                                            appliedTaxState={appliedTaxState}
                                            setAppliedTaxState={setAppliedTaxState}
                                            currency={currency}
                                            setCurrency={setCurrency}
                                            vacationPay={vacationPay}
                                            setVacationPay={setVacationPay}
                                            payPeriodType={payPeriodType}
                                            setPayPeriodType={setPayPeriodType}
                                            pay_type={pay_type}
                                            setPayType={setPayType}
                                            appliedTaxes={appliedTaxes}
                                            setAppliedTaxes={setAppliedTaxes}
                                            appliedDeductions={appliedDeductions} // ✅ New prop
                                            setAppliedDeductions={setAppliedDeductions} // ✅ Setter
                                            countryStateMap={countryStateMap}
                                            usStateNameToCode={usStateNameToCode}
                                            updateStubSettings={updateStubSettings}
                                        />
                                    </>
                                )}
                            </div>

                            {role === "manager" && (
                                <div style={{ marginTop: 20 }}>
                                    <div>
                                        <p className="employeeDetail">Manager For</p>
                                        <p style={{ fontSize: "16px", fontWeight: "400" }}>If enabled, {data.name} will be able to see selected user's Timeline and Reports, but not rates.</p>
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        {users?.filter(f => f._id !== fixId && f?.isArchived === false && f?.inviteStatus === false && f.userType !== "owner").map((f) => (
                                            <div key={f._id} style={{ display: "flex", marginBottom: 10 }}>
                                                <input
                                                    onChange={() => {
                                                        setUsers((prevUsers) => {
                                                            return prevUsers.map((user) => {
                                                                if (user._id === f._id) {
                                                                    const newIsAssign = !user.isAssign;
                                                                    if (newIsAssign) {
                                                                        handleAssignUser([f._id]); // Pass the updated userIds array
                                                                    } else {
                                                                        handleRemoveAssignUser(user._id); // Pass user ID to removal function
                                                                    }
                                                                    return {
                                                                        ...user,
                                                                        isAssign: newIsAssign,
                                                                        managerId: newIsAssign ? [...user.managerId, fixId] : user.managerId.filter(id => id !== fixId)

                                                                        // If newIsAssign is true, add fixId to managerId array; otherwise, remove fixId from the array
                                                                    };
                                                                }
                                                                return user;
                                                            })
                                                        });
                                                    }}
                                                    className="react-switch-checkbox"
                                                    id={`react-switch-${f._id}`}
                                                    type="checkbox"
                                                    checked={
                                                        f?.managerId?.length === 0 ? false : users.find((user) => user._id === f._id)?.managerId.includes(fixId)
                                                        // f?.managerId?.length === 0 ? false : users.find((user) => user._id === f._id)?.managerId.includes(fixId)
                                                    }
                                                />
                                                {user?.userType !== "manager" && <label
                                                    style={{
                                                        background:
                                                            f?.managerId?.length === 0
                                                                ? 'grey' // If managerId array is empty, set background to grey
                                                                : users.find((user) => user._id === f._id)?.managerId.includes(fixId)
                                                                    ? "#5CB85C" // If fixId is included in managerId array, set background to green
                                                                    : "grey" // Otherwise, set background to grey
                                                    }}
                                                    className="react-switch-label"
                                                    htmlFor={`react-switch-${f._id}`}
                                                >
                                                    <span className={`react-switch-button`} />
                                                </label>}
                                                <p style={{ margin: "0 0 0 10px", color: "#aaa", fontWeight: "500" }}>{f?.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}



                        </>
                    )}

                </>
            ) : (
                <img width={500} src={settingIcon} alt="" style={{ display: "block", margin: "auto" }} />
            )
            }

        </div >
    )
}

export default OwnerTeamComponent;











