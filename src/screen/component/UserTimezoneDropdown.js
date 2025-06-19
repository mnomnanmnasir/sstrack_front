import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const UserTimezoneDropdown = ({ onTimezoneChange }) => {
    const [usersByTimezone, setUsersByTimezone] = useState({});
    const [selectedTimezone, setSelectedTimezone] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `${apiUrl}/owner/getUsersTimezone`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.data.success) {
                    const users = response.data.Users;

                    // Group users by timezone
                    const grouped = users.reduce((acc, user) => {
                        if (!acc[user.timezone]) {
                            acc[user.timezone] = [];
                        }
                        acc[user.timezone].push(user);
                        return acc;
                    }, {});

                    setUsersByTimezone(grouped);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Convert timezones into options for react-select
    const timezoneOptions = Object.keys(usersByTimezone).map((timezone) => ({
        value: timezone,
        label: timezone,
    }));

    // Handle timezone selection
    const handleTimezoneChange = (selectedOption) => {
        setSelectedTimezone(selectedOption);
        onTimezoneChange(selectedOption, usersByTimezone);
    };

    return (
        <div>
            <Select
                value={selectedTimezone}
                onChange={handleTimezoneChange}
                options={timezoneOptions}
                placeholder="Select a Timezone"
                isClearable
                styles={{
                    control: (base) => ({
                        ...base,
                        padding: "5px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        fontSize: "16px",
                        cursor: "pointer",
                    }),
                }}
            />
        </div>
    );
};

export default UserTimezoneDropdown;
